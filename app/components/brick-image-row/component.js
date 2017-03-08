import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'ul',
  classNames: 'brick_row brick_row--images',
  group: Ember.computed('items', function() {
    return this.get('items');
  })
});
