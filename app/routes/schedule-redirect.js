import Route from 'ember-route';
import moment from 'moment';

export default Route.extend({
  redirect() {
    const year = moment().tz('America/New_York').format('YYYY');
    const month = moment().tz('America/New_York').format('MMM').toLowerCase();
    const day = moment().tz('America/New_York').format('DD');
    this.replaceWith('schedule', year, month, day, {
      queryParams: {
        scheduleStation: 'wnyc-fm939',
      },
    });
  },
});
