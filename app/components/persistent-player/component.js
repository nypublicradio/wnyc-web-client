import Ember from 'ember';
import service from 'ember-service/inject';

const {
  computed,
  get
} = Ember;

export default Ember.Component.extend({
  classNames: ['persistent-player'],
  audio: service(),
  storyTitle: computed.alias('audio.currentAudio.story.title'),
  storySlug: computed.alias('audio.currentAudio.story.slug'),
  parentTitle: computed.alias('audio.currentAudio.story.headers.brand.title'),
  parentUrl: computed.alias('audio.currentAudio.story.headers.brand.path'),

  actions: {
    increaseVolume() {
      get(this, 'audio').increaseVolume();
    },
    decreaseVolume() {
      get(this, 'audio').decreaseVolume();
    }
  }
});
