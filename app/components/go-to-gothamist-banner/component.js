import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',
  classNames: ['go-to-gothamist-banner'],
  attributeBindings: ['href', 'target'],
  href: 'http://gothamist.com/',
  target: '_blank'
});
