import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  redirect(model, { targetName, queryParams }) {
    const year = moment().tz('America/New_York').format('YYYY');
    const month = moment().tz('America/New_York').format('MMM').toLowerCase();
    const day = moment().tz('America/New_York').format('DD');
    this.replaceWith('schedule', year, month, day, {
      queryParams: {
        scheduleStation: queryParams.scheduleStation || 'wnyc-fm939'
      },
    });
  },
});
