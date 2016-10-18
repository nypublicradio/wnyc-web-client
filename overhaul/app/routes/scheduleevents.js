import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query('scheduleevent', { scheduleDate: '2016-09-09' });
  },
  actions: {
    isShowSchedule(object) {
      return object.objType === 'ShowSchedule';
    },
  },
});
