import { helper } from 'ember-helper';
import get from 'ember-metal/get';

export function shareMetadata(story) {
    let shareText = '';
    let shareUrl = '';
    let analyticsCode = '';

    if (story) {
      if (get(story, 'audioType') === 'stream') {
        let entry = get(story, 'currentPlaylistItem.catalogEntry');
        if (entry) {
          shareText = `${entry.title} - ${entry.composer.name}`;
          shareUrl = 'http://www.wnyc.org/streams/' + get(story, 'slug');
        } else {
          shareText = get(story, 'currentShow.title');
          shareUrl = get(story, 'currentShow.url');
        }
      } else {
        let title = get(story, 'title');
        let parentTitle = get(story, 'headers.brand.title');
        shareText = [parentTitle, title].filter(t => t).join(' - ');
        shareUrl = get(story, 'url');
        analyticsCode = get(story, 'analyticsCode');
      }
    }

    return({shareText, shareUrl, analyticsCode});
}

export default helper;

