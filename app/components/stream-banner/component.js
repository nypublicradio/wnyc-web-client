import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  stream: null,
  slug: readOnly('stream.slug'),
  showTitle: readOnly('stream.currentShow.showTitle'),
  episodeTitle: readOnly('stream.currentShow.episodeTitle'),
  currentSong: readOnly('stream.currentPlaylistItem.catalogEntry')
});
