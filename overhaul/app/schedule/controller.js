import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  queryParams: ['scheduleStation'],
  scheduleStation: null,
  currentlyLoading: null,
  todaysDateAsMoment: Ember.computed('params', function() {
    // Returns moment object for today's date, based on dynamic segment in URL
    const year = this.get('params.year');
    const month = this.get('params.month');
    const day = this.get('params.day');
    return moment(`${year}-${month}-${day}`, 'YYYY-MMM-DD');
  }),
  fullDayAndDate: Ember.computed('todaysDateAsMoment', function () {
    // Returns the full readable day/date, e.g. "Tuesday, October 18, 2016"
    return this.get('todaysDateAsMoment').clone().format('dddd, MMMM D, YYYY');
  }),
  yesterday: Ember.computed('todaysDateAsMoment', function() {
    // Returns the name of yesterday's day ("Monday")
    return this.get('todaysDateAsMoment').clone().add(-1, 'days').format('dddd');
  }),
  yesterdayLink: Ember.computed('todaysDateAsMoment', function() {
    const yesterdayMoment = this.get('todaysDateAsMoment').clone().add(-1, 'days');
    return {
      year: yesterdayMoment.format('YYYY'),
      month: yesterdayMoment.format('MMM').toLowerCase(),
      day: yesterdayMoment.format('DD'),
    };
  }),
  tomorrow: Ember.computed('todaysDateAsMoment', function() {
    // Returns the name of tomorrow's day ("Wednesday")
    return this.get('todaysDateAsMoment').clone().add(1, 'days').format('dddd');
  }),
  tomorrowLink: Ember.computed('todaysDateAsMoment', function() {
    const tomorrowMoment = this.get('todaysDateAsMoment').clone().add(1, 'days');
    return {
      year: tomorrowMoment.format('YYYY'),
      month: tomorrowMoment.format('MMM').toLowerCase(),
      day: tomorrowMoment.format('DD'),
    };
  }),
});
