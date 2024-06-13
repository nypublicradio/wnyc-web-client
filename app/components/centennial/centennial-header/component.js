import Component from '@ember/component';
import config from 'wnyc-web-client/config/environment';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('socialIcons', [
          { url: 'https://www.instagram.com/wnyc', icon: 'instagram' },
          { url: 'http://x.com/wnyc', icon: 'x' },
          { url: 'https://www.youtube.com/channel/UCbysmY4hyViQAAYEzOR-uCQ', icon: 'youtube' },
          { url: 'http://www.facebook.com/wnyc', icon: 'facebook' }
        ]);
      this.set('staticAssetPath', config.staticAssetPath);
},
});
