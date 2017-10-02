import StoryModel from 'nypr-publisher-lib/models/story';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default StoryModel.extend({
  shareMetadata: computed(function() {
    let title = get(this, 'twitterHeadline') || get(this, 'title');
    let parentTitle = get(this, 'headers.brand.title');
    let shareUrl = get(this, 'url');
    let analyticsCode = get(this, 'analyticsCode') || '';

    let shareText = [parentTitle, title].filter(t => t).join(' - ');
    let via = get(this, 'twitterHandle') || 'WNYC';

    return {shareText, shareUrl, analyticsCode, via};
  })
});
