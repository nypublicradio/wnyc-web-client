import Ember from 'ember';
import service from 'ember-service/inject';

export default Ember.Mixin.create({
  audio: service(),
  
  // check return value of super objects and respect if they don't
  //  want the event to bubble
  actions: {
    didTransition() {
      let play = this.controllerFor('application').get('play');
      if (play) {
        this.get('audio').play(play);
      }
      
      let ret = this._super(...arguments);
      return ret === false ? ret : true;
    },
    willTransition() {
      this.controllerFor('application').set('play', null);
      
      let ret = this._super(...arguments);
      return ret === false ? ret : true;
    }
  }
});
