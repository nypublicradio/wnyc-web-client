import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';

const MENU_SELECTORS = '#navigation-menu';
const HOMEPAGE_SELECTORS = '#wnyc_home a[href^=http], #wnyc_home a.external-link';
const SHARE_SELECTORS = '.js-share';
const HEADER_SELECTORS = '#brand-logo, .header-wide-button, #header .user-logout, #header .user-login';

function contains(selector, target) {
  let results = target.closest(selector);
  return !!results;
}

export default Service.extend({
  metrics: service(),
  store: service(),

  dispatch(e) {
    let target = e.target || e.currentTarget;

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
    target = document.querySelector(target);
    const title = target.textContent.trim();
    const destinationUrl = target.getAttribute('href') !== '#' ? target.getAttribute('href') : false;
    const metrics = get(this, 'metrics');

    metrics.trackEvent('GoogleAnalytics', {
      category: category,
      action: `Clicked "${title}"`,
      label: `${destinationUrl || 'no URL'}`
    });
  },

  _trackHomepage({target}) {
    let li = target.closest('li');
    let index = Array.from(li.parentElement.children).indexOf(li);
    let bucket = target.closest('.bucket, #damost');
    let position = bucket.getAttribute('data-position');
    let title = bucket.querySelector('.bucket-title, #damost-nav .active');
    title = title.textContent.trim();
    let metrics = get(this, 'metrics');

    metrics.trackEvent('GoogleAnalytics', {
      category: 'Homepage Bucket',
      action : `Clicked story in bucket ${position} with title "${title}"`,
      label : `Headline clicked: "${target.textContent.trim()}", url: ${target.getAttribute('href')}`,
      value : index + 1  // zero-indexing is for computers, 1-indexing is for people
    });
  },

  _trackShare({target}) {
    /*global wnyc*/

    let metrics = get(this, 'metrics');
    let store = get(this, 'store');
    let story = store.peekRecord('story', wnyc.current_item.id);
    let {containers, title} = get(story, 'analytics');

    let dataCategory = target.closest('[data-category]');
    let sharedVia = dataCategory.getAttribute('data-category');

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

    metrics.trackEvent('GoogleAnalytics', {
      category: 'Share',
      action: `${containers} | Title: ${title}`,
      label: sharedVia,
      model: story
    });
  }
});
