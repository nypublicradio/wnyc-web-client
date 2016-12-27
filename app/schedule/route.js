import Route from 'ember-route';
import moment from 'moment';

export default Route.extend({
  titleToken() {
    const fullDayAndDate = this.controllerFor('schedule').get('fullDayAndDate');
    return `Schedule for ${fullDayAndDate}`;
  },
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model({year, month, day, scheduleStation}) {
    const apiQueryParams = {};

    // Pulled from query string attached to URL; if nothing, wnyc-fm939
    apiQueryParams.scheduleStation = scheduleStation;

    // Set API query string scheduleDate to URL's date; otherwise, set to today
    const scheduleDate = moment(`${year} ${month} ${day}`, 'YYYY MMM DD').format('YYYY-MM-DD');
    apiQueryParams.scheduleDate = scheduleDate;

    return this.store.query('schedule', apiQueryParams);
  },
  setupController: function(controller, model) {
    controller.setProperties(this.paramsFor('schedule'));
    this._super(controller, model);
  },
  actions: {
    loading: function(transition) {
      const controller = this.controllerFor('schedule');
      controller.set('currentlyLoading', true);
      transition.promise.finally(function() {
        controller.set('currentlyLoading', false);
      });
    },
  },
});
