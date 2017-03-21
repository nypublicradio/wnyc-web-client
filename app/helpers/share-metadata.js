import { helper } from 'ember-helper';
import get from 'ember-metal/get';

export function shareMetadata(story) {
    let shareText = '';
    let shareUrl = '';
    let analyticsCode = '';

    if (story) {
      if (get(story, 'audioType') === 'livestream') {
        let entry = get(story, 'currentPlaylistItem.catalogEntry');
        if (entry) {
          shareText = 'I\'m listening to ' + entry.composer.name + ' - ' + entry.title;
          shareUrl = 'http://www.wqxr.org/streams/' + get(story, 'slug');
        } else {
          shareText = 'I\'m listening to ' + get(story, 'currentShow.title');
          shareUrl = get(story, 'currentShow.url');
        }
      } else {
        let title = get(story, 'title');
        let parentTitle = get(story, 'headers.brand.title');
        shareText = 'I\'m listening to ' + [parentTitle, title].filter(t => t).join(' - ');
        shareUrl = get(story, 'url');
        analyticsCode = get(story, 'analyticsCode') || '';
      }
    }

    return({shareText, shareUrl, analyticsCode});
}

export default helper(shareMetadata);
