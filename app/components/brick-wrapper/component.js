import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  groups: Ember.computed('items', function() {
    let items = this.get('items');
    return [
      items.slice(0, 3),
      items.slice(3, 6),
      items.slice(8)
    ];
  })
});
