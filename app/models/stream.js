import StreamModel from 'nypr-publisher-lib/models/stream';
import { computed } from '@ember/object';
import { get } from '@ember/object';

export default StreamModel.extend({
  shareMetadata: computed('currentShow', 'currentPlaylistItem', function() {
    let shareText = '';
    let shareUrl = '';

    let entry = get(this, 'currentPlaylistItem.catalogEntry');
    if (entry) {
      shareText = `${entry.title} - ${entry.composer.name}`;
      shareUrl = 'http://www.wnyc.org/streams/' + get(this, 'slug');
    } else {
      shareText = get(this, 'currentShow.title');
      shareUrl = get(this, 'currentShow.url');
    }

    return ({shareText, shareUrl});
  }),
})
