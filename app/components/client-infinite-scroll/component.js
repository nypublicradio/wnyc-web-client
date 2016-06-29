import Ember from 'ember';

 var $window = Ember.$(window),
  $document = Ember.$(document),
    bind = Ember.run.bind;

export default Ember.Component.extend({
  page: 1,
  isFetching: false,

  hasMore: Ember.computed('shows', 'activeShows', function(){
    return (this.get('activeShows.length') < this.get('shows.length'));
  }),

  totalShows: Ember.computed.alias('shows.length'),

  activeShows: Ember.computed('shows', 'page', function(){
    return this.get('shows').slice(0, this.get('page')*10 );
  }),

  didUpdateAttrs(){
    this._super(...arguments);
    this.set('page', 1);
    this.set('isFetching', false);
  },

  didInsertElement: function() {
    this._super(...arguments);
    $window.on('scroll.infinite', bind(this, this.didScroll));
  },
 
  willDestroyElement: function() {
    this._super(...arguments);
    $window.off('scroll.infinite');
  },
 
  didScroll: function() {
    if (this.scrolledToEnd() && this.get('hasMore') && !this.get('isFetching')) {
      this.set('isFetching', true);
      Ember.run.later(()=>{
        this.incrementProperty('page');
        this.set('isFetching', false);
      }, 1000);
      } 
  },

  scrolledToEnd: function(){
    var viewportTop =  $document.scrollTop() + $window.height(),
      xBottom = this.$().height() + this.$().offset().top - 150;

    // is the bottom of the element nearly in view?
    if (viewportTop > xBottom){
      return true;
    } else {
      return false;
    }
  },

});
