import StreamModel from 'nypr-publisher-lib/models/stream';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default StreamModel.extend({
  shareMetadata: computed('currentShow', 'currentPlaylistItem', function() {
    let shareText = '';
    let shareUrl = '';
    let analyticsCode = '';
    let via = get(this, 'twitterHandle') || 'WQXR';

    let entry = get(this, 'currentPlaylistItem.catalogEntry');
    if (entry) {
      shareText = `I'm listening to ${entry.composer.name} - ${entry.title}`;
      shareUrl = `http://www.wqxr.org/streams/?stream=${get(this, 'slug')}`;
    } else {
      shareText = `I'm listening to ${get(this, 'currentShow.title')}`;
      shareUrl = get(this, 'currentShow.url');
    }

    return {shareText, shareUrl, analyticsCode, via};
  })
});
