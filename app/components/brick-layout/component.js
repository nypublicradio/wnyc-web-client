import Ember from 'ember';

export default Ember.Component.extend({
  largeStoryRow1: Ember.computed('items', function(){
    return this.get('items').slice(0,1);
  }),
  colStoriesRow1: Ember.computed('items', function(){
    return this.get('items').slice(1,3);
  }),
  colStoriesRow2: Ember.computed('items', function(){
    return this.get('items').slice(3,5);
  }),
  largeStoryRow2: Ember.computed('items', function(){
    return this.get('items').slice(5,6);
  }),
});
