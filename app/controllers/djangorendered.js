import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['scheduleStation', 'next', 'q'],
  scheduleStation: null,
  next: null,
  q: null
});
