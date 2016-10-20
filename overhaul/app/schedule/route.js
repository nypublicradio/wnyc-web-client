import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model(params) {
    this.set('params', params);
    const apiQueryParams = {};

    // Pulled from query string attached to URL; if nothing, wnyc-fm939
    apiQueryParams.scheduleStation = this.get('params.scheduleStation');

    // Set API query string scheduleDate to URL's date; otherwise, set to today
    if (params.year && params.month && params.day) {
      const scheduleDate = moment(`${params.year} ${params.month} ${params.day}`, 'YYYY MMM DD').format('YYYY-MM-DD');
      apiQueryParams.scheduleDate = scheduleDate;
    } else {
      apiQueryParams.scheduleDate = moment().format('YYYY-MM-DD');
    }

    return this.store.query('schedule', apiQueryParams);
  },
  setupController: function(controller, model) {
    controller.set('params', this.get('params'));
    this._super(controller, model);
  },
  actions: {
    loading: function(transition) {
      const controller = this.controllerFor('schedule');
      controller.set('currentlyLoading', 'currentlyLoading');
      transition.promise.finally(function() {
        controller.set('currentlyLoading', null);
      });
    },
  },
});
