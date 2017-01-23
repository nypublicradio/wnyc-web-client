import Component from 'ember-component';
import { reads, or } from 'ember-computed';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

export default Component.extend({
  // TODO: would like to inject an audio-analytics service here
  audio:          service(),
  
  tagName:        '',
  story:          or('currentAudio.currentStory', 'currentAudio'),
  show:           reads('currentAudio.headers.brand'),
  catalogEntry:   reads('currentAudio.currentPlaylistItem.catalogEntry'),
  showUrl:        or('show.url', 'currentAudio.currentShow.showUrl'),
  storyTitle:     or('currentAudio.title', 'currentAudio.currentShow.episodeTitle'),
  storyUrl:       or('currentAudio.url', 'currentAudio.currentShow.episodeUrl'),

  didReceiveAttrs({oldAttrs, newAttrs}) {
    this._super(...arguments);
    let currentAudio = this.get('currentAudio');
    if (!currentAudio || get(currentAudio, 'audioType') !== 'stream') { return; }
    if (oldAttrs.showTitle === newAttrs.showTitle) { return; }
    
    this.get('audio').trackStreamData(currentAudio);
  }
});
