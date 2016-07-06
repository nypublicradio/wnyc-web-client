import Component from 'ember-component';

export default Component.extend({
  tagName:      'form',
  elementId:    'search-form',
  classNames:   ['promoted-layer', 'animate-transforms'],

  submit(e) {
    e.preventDefault();
    this.get('search')(this.get('q'));
  }
});
