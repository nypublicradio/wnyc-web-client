import Ember from 'ember';
import service from 'ember-service/inject';

const { get } = Ember;

export default Ember.Component.extend({
  audio: service(),
  classNames: ['persistent-player'],

  actions: {
    increaseVolume() {
      get(this, 'audio').increaseVolume();
    },
    decreaseVolume() {
      get(this, 'audio').decreaseVolume();
    }
  }
});
