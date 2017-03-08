import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  item: Ember.computed('items', function(){
    return this.get('items');
  }),
});
