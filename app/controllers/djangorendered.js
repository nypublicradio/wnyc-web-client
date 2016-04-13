import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['scheduleStation', 'next'],
  scheduleStation: null,
  next: null
});
