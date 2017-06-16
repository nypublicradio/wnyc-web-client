import Component from 'ember-component';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

const ASSET_MAP = {
  '404': '/assets/img/error/violinist.jpg'
};

const TEXT_MAP = {
  '404': {
    headline: "Something's missing",
    sub: "(404) We can't find the page you're looking for. Please check the url and try again."
  }
};

export default Component.extend({
  classNames: ['error-page'],
  attributeBindings: ['style'],
  
  style: computed('errorCode', function() {
    let imagePath = ASSET_MAP[this.get('errorCode')];
    return htmlSafe(`background-image: url(${imagePath});`);
  }),
  headline: computed('errorCode', function() {
    let text = TEXT_MAP[this.get('errorCode')];
    if (text) {
      return text.headline;
    }
  }),
  sub: computed('errorType', function() {
    let text = TEXT_MAP[this.get('errorCode')];
    if (text) {
      return text.sub;
    }
  }),
});
