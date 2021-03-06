import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',
  classNames: ['go-to-gothamist-banner'],
  attributeBindings: ['href', 'target', 'data-category', 'data-action', 'data-label'],
  href: 'http://gothamist.com?utm_medium=partnersite&utm_source=wnyc&utm_campaign=banner',
  target: '_blank'
});
