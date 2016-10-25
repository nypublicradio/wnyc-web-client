import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  queryParams: ['scheduleStation'],
  scheduleStation: null,
  currentlyLoading: null,
  todaysDateAsMoment: Ember.computed('year', 'month', 'day', function() {
    // Returns moment object for today's date, based on dynamic segment in URL
    return moment(`${this.get('year')}-${this.get('month')}-${this.get('day')}`, 'YYYY-MMM-DD');
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
