import StoryModel from 'nypr-publiser-lib/models/story';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default StoryModel.extend({
  shareMetadata: computed(function() {
    let title = get(this, 'twitterHeadline') || get(this, 'title');
    let parentTitle = get(this, 'headers.brand.title');
    let shareText = 'I\'m listening to ' + [parentTitle, title].filter(t => t).join(' - ');
    let shareUrl = get(this, 'url');
    let analyticsCode = get(this, 'analyticsCode') || '';  
    let via = get(this, 'twitterHandle') || 'WQXR';

    return {shareText, shareUrl, analyticsCode, via};
  })
});
