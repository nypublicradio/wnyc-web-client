import Ember from 'ember';
import service from 'ember-service/inject';
import computed, { reads, equal, not } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Ember.Component.extend({
  audio:    service(),
  session:  service(),
  store:    service(),
  bumper:   service('bumper-state'),

  currentAudio: reads('audio.currentAudio'),

  currentTitle: computed.or('currentAudio.title', '_currentTitleFromShow'),

  playingAudioType: 'ondemand', //bumper, stream, ondemand

  queueLength: 0,

  showQueue: false,

  _currentTitleFromShow: computed('currentAudio', function() {
    return `${this.get('currentAudio.currentShow.showTitle')} on ${this.get('currentAudio.name')}`;
  })
});
