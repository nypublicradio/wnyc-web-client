import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.set('socialIcons', [
          { url: 'https://www.instagram.com/wnyc', icon: 'instagram' },
          { url: 'http://www.twitter.com/wnyc', icon: 'twitter' },
          { url: 'https://www.youtube.com/channel/UCbysmY4hyViQAAYEzOR-uCQ', icon: 'youtube' },
          { url: 'http://www.facebook.com/wnyc', icon: 'facebook' }
        ]);
},
});
