import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
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
  session: Ember.inject.service(),
  classNames: ['settings-body'],
  prevAutoplayPref: 'default_stream',
  actions: {
    toggleAutoplay(enableAutoplay) {
      let session = this.get('session');
      let value = enableAutoplay ? this.get('prevAutoplayPref') : 'no_autoplay';
      session.set('data.user-prefs-active-autoplay', value);
    },

    selectStream(stream) {
      let session = this.get('session');
      session.set('data.user-prefs-active-stream', stream.getProperties('slug', 'name'));
    },

    selectAutoPlayPref({ field }) {
      let session = this.get('session');
      this.set('prevAutoplayPref', field === 'default_stream' ? field : 'queue');
      session.set('data.user-prefs-active-autoplay', field);
    }
  }
});
