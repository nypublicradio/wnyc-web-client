import Component from 'ember-component';
import { reads, or } from 'ember-computed';

export default Component.extend({
  tagName:        '',
  story:          or('currentAudio.currentStory', 'currentAudio'),
  show:           reads('currentAudio.headers.brand'),
  catalogEntry:   reads('currentAudio.currentPlaylistItem.catalogEntry'),
  showTitle:      or('show.title', 'currentAudio.currentShow.showTitle'),
  showUrl:        or('show.url', 'currentAudio.currentShow.showUrl'),
  storyTitle:     or('currentAudio.title', 'currentAudio.currentShow.episodeTitle'),
  storyUrl:       or('currentAudio.url', 'currentAudio.currentShow.episodeUrl')
});
