import service from 'ember-service/inject';
import Ember from 'ember';
const {
  $,
  get,
  Service,
} = Ember;

const MENU_SELECTORS = '#navigation-menu';
const HOMEPAGE_SELECTORS = '#wnyc_home a[href^=http], #wnyc_home a.external-link';
const SHARE_SELECTORS = '.js-share';
const HEADER_SELECTORS = '#brand-logo, .header-wide-button, #header .user-logout, #header .user-login';

function contains(selector, target) {
  let results = $(target).closest(selector);
  return !!results.length;
}

export default Service.extend({
  metrics: service(),
  store: service(),

  dispatch(e) {
    let {target} = e;

    if (contains(MENU_SELECTORS, target)) {
      this._trackLinkWithText(e, 'WNYC Menu');
    } else if (contains(HEADER_SELECTORS, target)) {
      this._trackLinkWithText(e, 'WNYC Header');
    } else if (contains(HOMEPAGE_SELECTORS, target)) {
      this._trackHomepage(e);
    } else if (contains(SHARE_SELECTORS, target)) {
      this._trackShare(e);
    }
  },

  _trackLinkWithText({target}, category) {
    const $target = $(target);
    const title = $target.text().trim();
    const destinationUrl = $target.attr('href') !== '#' ? $target.attr('href') : false;
    const metrics = get(this, 'metrics');

    metrics.trackEvent({
      category: category,
      action: `Clicked "${title}"`,
      label: `${destinationUrl || 'no URL'}`
    });
  },

  _trackHomepage({target}) {
    let $tgt = $(target);
    let $li = $tgt.closest('li');
    let index = $li.index();
    let $bucket = $tgt.closest('.bucket, #damost');
    let position = $bucket.attr('data-position');
    let $title = $bucket.find('.bucket-title, #damost-nav .active');
    let title = $title.text().trim();
    let metrics = get(this, 'metrics');

    metrics.trackEvent({
      category: 'Homepage Bucket',
      action : `Clicked story in bucket ${position} with title "${title}"`,
      label : `Headline clicked: "${$tgt.text()}", url: ${$tgt.attr('href')}`,
      value : index + 1  // zero-indexing is for computers, 1-indexing is for people
    });
  },

  _trackShare({target}) {
    let metrics = get(this, 'metrics');
    let store = get(this, 'store');
    let story = store.peekRecord('story', wnyc.current_item.id);
    let {containers, title} = get(story, 'analytics');

    /*global wnyc*/
    let $clickedEl = $(target);
    let dataCategory = $clickedEl.closest('[data-category]');
    let sharedVia = dataCategory.data('category');

    switch(sharedVia){
      case 'SharedE':
        sharedVia = 'Email';
        break;
      case 'SharedF':
        sharedVia = 'Facebook';
        break;
      case 'SharedT':
        sharedVia = 'Twitter';
        break;
      default: 
        sharedVia = '';
        break;
    }

    metrics.trackEvent({
      category: 'Share',
      action: `${containers} | Title: ${title}`,
      label: sharedVia
    });
  }
});
