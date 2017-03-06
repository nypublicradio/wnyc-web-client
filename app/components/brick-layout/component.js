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
  cardsRow1: Ember.computed('items', function(){
    return this.get('items').slice(6,8);
  }),
  largeStoryRow3: Ember.computed('items', function(){
    return this.get('items').slice(8,9);
  }),
  colStoriesRow3: Ember.computed('items', function(){
    return this.get('items').slice(9,11);
  }),
  colStoriesRow4: Ember.computed('items', function(){
    return this.get('items').slice(11,13);
  }),
  largeStoryRow4: Ember.computed('items', function(){
    return this.get('items').slice(13,14);
  }),
  cardsRow2: Ember.computed('items', function(){
    return this.get('items').slice(14,16);
  }),
});
