import Component from '@ember/component';
import config from 'wnyc-web-client/config/environment';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('staticAssetPath', config.staticAssetPath);
  }
});
