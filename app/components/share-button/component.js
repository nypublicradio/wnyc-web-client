import Component from 'ember-component';
import { readOnly } from 'ember-computed';
import get, {getProperties} from 'ember-metal/get';
import service from 'ember-service/inject';

export default Component.extend({
  text: null,
  region: null,
  story: null,
  type: null,
  metrics: service(),
  classNames: ['sharebutton'],
  metadata: readOnly('story.shareMetadata'),
  actions: {
    popupShareWindow(destination, href) {
      const heights = {
        'Twitter': 433,
        'Facebook': 620
      };
      let {metadata={}, region, type} = getProperties(this, 'metadata', 'region', 'type');
      let {shareText, analyticsCode} = metadata;
      if (href) {
        let metrics = get(this, 'metrics');
        metrics.trackEvent({
          category: 'Persistent Player',
          action: `Shared Story "${shareText}"`,
          label: `${region}|${analyticsCode}|${type}|${destination}`,
          });
        let features = `titlebar=no,close=no,width=600,height=${heights[destination]}`;
        window.open(href, '_blank', features);
      }
    }
  }
});
