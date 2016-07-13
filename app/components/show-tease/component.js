import Ember from 'ember';

export default Ember.Component.extend({
  showUrl: Ember.computed('show.slug', function(){
    return '/shows/' + this.get('show.slug');
  })
});
