import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import { urlEncode } from 'overhaul/helpers/url-encode';
import { shareMetadata } from 'overhaul/helpers/share-metadata';

export default Component.extend({
  region: null,
  type: null,
  classNames: ['sharebutton'],
  // if the passed in story is a stream, these two attrs will update separately
  // of the story attr.
  shareLinks: computed('story', 'story.currentPlaylistItem', 'story.currentShow', function() {
    let story = get(this, 'story');
    let {shareText, shareUrl, analyticsCode} = shareMetadata(story);
    let region = this.get('region');
    let type = this.get('type');

    return [{
      text: "Facebook",
      href:  `https:\/\/www.facebook.com/sharer/sharer.php?u=${urlEncode(shareUrl)}`,
      target: '_blank',
      trackingCategory: 'Persistent Player',
      trackingAction: `Shared Story "${shareText}"`,
      trackingLabel: `${region}|${analyticsCode}|${type}|Facebook`,
    },{
      text: "Twitter",
      href: `https:\/\/twitter.com/intent/tweet?url=${urlEncode(shareUrl)}&text=${urlEncode(shareText)}&via=WNYC`,
      target: '_blank',
      trackingCategory: 'Persistent Player',
      trackingAction: `Shared Story "${shareText}"`,
      trackingLabel: `${region}|${analyticsCode}|${type}|Twitter`,
    },{
      text: "Email",
      href: `mailto:?subject=${urlEncode(shareText)}&body=${urlEncode(shareUrl)}`,
      target: '',
      trackingCategory: 'Persistent Player',
      trackingAction: `Shared Story "${shareText}"`,
      trackingLabel: `${region}|${analyticsCode}|${type}|Email`,
    }];
  })
});
