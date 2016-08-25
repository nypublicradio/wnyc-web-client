import Component from 'ember-component';
import service from 'ember-service/inject';
import { readOnly } from 'ember-computed';

export default Component.extend({
  audio: service(),
  stream: null,
  slug: readOnly('stream.slug'),
  showTitle: readOnly('stream.currentShow.showTitle'),
  episodeTitle: readOnly('stream.currentShow.episodeTitle'),
  currentSong: readOnly('stream.currentPlaylistItem.catalogEntry')
});
