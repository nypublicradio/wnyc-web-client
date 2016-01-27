import Ember from 'ember';

const {
  Component,
  $,
  computed,
  get
} = Ember;

export default Component.extend({
  tagName: '',
  isTwitter: computed.equal('item.service', 'twitter'),
  iconname: computed('item', {
    get() {
      const svc = get(this, 'item.service')
      return svc === 'email' ? 'envelope' : svc
    }
  }),
  url: computed('item', {
    get() {
      const svc = get(this, 'item.service')
      const user = get(this, 'item.contactString')

      switch(svc) {
        case 'facebook':
          return `http:\/\/facebook.com/${user}`
          break;
        case 'instagram':
          return `http:\/\/instagram.com/${user}`
          break;
        case 'email':
          return `mailto:${user}`
          break;
        default:
          return null;
      }
    }
  }),

  didInsertElement() {
    if (this.get('isTwitter')) {
      this._insertTwitter()
    }
  },
  _insertTwitter() {
    const $s = $('<script/>', { id: 'twitter-wjs', src: '//platform.twitter.com/widgets.js' })
    $(document).find('head').prepend($s)
  }
});
