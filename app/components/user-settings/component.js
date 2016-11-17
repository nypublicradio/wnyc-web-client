import Ember from 'ember';
import service from 'ember-service/inject';
const { computed } = Ember;

export default Ember.Component.extend({
  metrics: service(),
  session: service(),
  autoPlayPrefs: [
    { name: 'My Default Stream', field: 'default_stream' },
    { name: 'My Queue', field: 'queue' }
  ],

  enableAutoplay: computed.equal('session.data.user-prefs-active-autoplay', 'no_autoplay'),
  activeStream: computed('session.data.user-prefs-active-stream.slug', function(){
    let streams = this.get('streams');
    let currentStream = this.getWithDefault('session.data.user-prefs-active-stream', {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'});
    return streams.findBy('slug', currentStream.slug);
  }),

  activePref: computed('session.data.user-prefs-active-autoplay', function() {
    let prefs = this.get('autoPlayPrefs');
    let pref = this.getWithDefault('session.data.user-prefs-active-autoplay', 'default_stream');

    if (pref === 'no_autoplay') {
      return prefs.find(p => p.field === this.get('prevAutoplayPref'));
    }

    return prefs.find(p => p.field === pref);
  }),
  classNames: ['settings-body'],
  prevAutoplayPref: 'default_stream',
  actions: {
    toggleAutoplay(enableAutoplay) {
      let metrics = this.get('metrics');
      metrics.trackEvent('GoogleAnalytics', {
        category: "Settings",
        action:   "Continuous Play Toggle",
        label:    enableAutoplay ? "on" : "off"
      });

      let session = this.get('session');
      let value = enableAutoplay ? this.get('prevAutoplayPref') : 'no_autoplay';
      session.set('data.user-prefs-active-autoplay', value);
    },

    selectStream(stream) {
      let metrics = this.get('metrics');
      metrics.trackEvent('GoogleAnalytics', {
        category: "Settings",
        action:   "Continuous Play Stream",
        label:    stream.get('name')
      });

      let session = this.get('session');
      session.set('data.user-prefs-active-stream', stream.getProperties('slug', 'name'));
    },

    selectAutoPlayPref({ field }) {
      let metrics = this.get('metrics');
      metrics.trackEvent('GoogleAnalytics', {
        category: "Settings",
        action:   "Continuous Play Target",
        label:    field === 'default_stream' ? this.get('activeStream.name') : 'queue'
      });

      let session = this.get('session');
      this.set('prevAutoplayPref', field === 'default_stream' ? field : 'queue');
      session.set('data.user-prefs-active-autoplay', field);
    }
  }
});
