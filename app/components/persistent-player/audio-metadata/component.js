import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Component.extend({
  // TODO: would like to inject an audio-analytics service here
  audio:          service(),
  
  tagName:        '',

  showTitle:      null,
  showUrl:        null,

  storyTitle:     null,
  storyUrl:       null,
  
  audioId:        null,
  songDetails:   null,
  
  didReceiveAttrs({oldAttrs, newAttrs}) {
    this._super(...arguments);
    let currentAudio = this.get('audio.currentAudio');
    if (!currentAudio || get(currentAudio, 'audioType') !== 'stream') { return; }
    if (oldAttrs.showTitle === newAttrs.showTitle) { return; }
    
    this.get('audio').trackStreamData(currentAudio);
  }
});
