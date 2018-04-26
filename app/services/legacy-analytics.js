import { get } from '@ember/object';
import Service, { inject as service } from '@ember/service';

const SHARE_SELECTORS = '.js-share';

function contains(selector, target) {
  let results = target.closest(selector);
  return !!results;
}

export default Service.extend({
  metrics: service(),
  store: service(),

  dispatch(e) {
    let target = e.target || e.currentTarget;

    if (contains(SHARE_SELECTORS, target)) {
      this._trackShare(e);
    }
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
