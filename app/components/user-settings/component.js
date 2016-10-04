import Ember from 'ember';
const { computed } = Ember;

export default Ember.Component.extend({
  /*
  I imagine that the stream list is actually quite large? If so, then do we
  want the ability to use the search component that ember-power-select comes
  with?
  */
  autoPlayPrefs: [
    { name: 'My Default Stream', field: 'default_stream' },
    { name: 'My Queue', field: 'queue' }
  ],

  enableAutoplay: computed.equal('session.data.user-prefs-active-autoplay', 'no_autoplay'),
  activeStream: computed('session.data.user-prefs-active-stream', function(){
    var streams = this.get('streams');
    var currentStream = this.get('session.data.user-prefs-active-stream');
    var stream;
    if (currentStream) {
      stream = streams.findBy('slug', currentStream);
    } else {
      stream = streams.get('firstObject');
    }

    return stream;
  }),
  // and this, too
  activePref: computed('session.data.user-prefs-active-autoplay', function() {
    var prefs = this.get('autoPlayPrefs');
    var pref = this.get('session.data.user-prefs-active-autoplay');

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
      // until we resolve what the user preference endpoint will be, set the
      // session.data.userPref.activeStream
      let session = this.get('session');
      session.set('data.user-prefs-active-stream', stream.get('slug'));
    },
    selectAutoPlayPref({ field }) {
      // until we resolve what the user preference endpoint will be, set the
      // session.data.userPref.activePref
      let session = this.get('session');
      this.set('prevAutoplayPref', field === 'default_stream' ? field : 'queue');
      session.set('data.user-prefs-active-autoplay', field);
    }
  }
});
