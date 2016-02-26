import service from 'ember-service/inject';
import Ember from 'ember';
const {
  $,
  get,
  Service,
  run
} = Ember;

const BASIC_SELECTORS = '.js-track-links';
const HOMEPAGE_SELECTORS = '#wnyc_home a[href^=http], #wnyc_home a.external-link';
const SHARE_SELECTORS = '.js-share';

export default Service.extend({
  metrics: service(),

  dispatch(e) {
    let { target } = e;
    let link = $(target).closest('a')[0];

    if (Array.from(document.querySelectorAll(BASIC_SELECTORS)).contains(link)) {
      this._trackMenu(e);
    } else if (Array.from(document.querySelectorAll(HOMEPAGE_SELECTORS)).contains(link)) {
      this._trackHomepage(e);
    } else if (Array.from(document.querySelectorAll(SHARE_SELECTORS)).contains(link)) {
      this._trackShare(e);
    }
  },

  _trackMenu({target}) {
    const $target = $(target);
    const title = $target.text().trim();
    const destinationUrl = $target.attr('href') !== '#' ? $target.attr('href') : false;
    const metrics = get(this, 'metrics');

    metrics.trackEvent({
      category: 'WNYC Menu',
      action: `Clicked "${title}"`,
      label: `"${title}" with URL "${destinationUrl || 'no URL'}"`
    });

    if (destinationUrl) {
      run.later(this, () => window.location = destinationUrl, 100);
    }
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

    /*global wnyc*/
    let $clickedEl = $(target);
    let dataCategory = $clickedEl.closest('[data-category]');
    let sharedVia = dataCategory.data('category');
    let showName = wnyc.current_item.show;
    let storyTitle = wnyc.current_item.title;

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
      action: `${showName ? `Show: ${showName} | ` : ''}Title: ${storyTitle}`,
      label: sharedVia
    });
  }
});
