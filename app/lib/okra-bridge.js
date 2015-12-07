import Ember from 'ember';
const { Promise } = Ember.RSVP;

export function installBridge() {
  XDPlayer.on('initialize:after', function() {
    Okra.start();
  });
  XDPlayer.start();
}

export function playOnDemand(pk) {
  Okra.execute('playOnDemand', pk);
}

export default Ember.Object.extend({
  audioService: Ember.computed(function() {
    return new Promise(resolve => {
      let interval = setInterval(() => {
        if (typeof Okra !== 'undefined') {
          clearInterval(interval);
          Okra.on('initialize:after', function() {
            resolve(Okra.request('audioService'));
          });
        }
      }, 20);
    });
  }),
  playerModel: Ember.computed('audioService', {
    get() {
      return this.get('audioService').then(a => a.playerModel);
    }
  }),
  init() {
    let aS = this.get('audioService');
    let pM = this.get('playerModel');
    aS.then(c => c.on('player:progress', m => this.set('position', m.normalised)));
    pM.then(p => p.on('change:isPlaying', (m,e) => this.set('isPlaying', e)));
  },
});
