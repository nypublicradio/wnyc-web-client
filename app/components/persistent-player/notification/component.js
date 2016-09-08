import Ember from 'ember';

export default Ember.Component.extend({
  secondsRemaining: Ember.computed('position', function(){
    return (this.get('position') / 1000) - 15; // ms -> s
  })
});
