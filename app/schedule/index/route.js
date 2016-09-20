import Route from 'ember-route';
import moment from 'moment';

export default Route.extend({
  redirect(model, transition) {
    if (transition.targetName !== 'schedule.date') {
      let year  = moment().format('YYYY');
      let month = moment().format('MMM').toLowerCase();
      let day   = moment().format('DD');
      this.replaceWith('schedule.date', year, month, day, {
        queryParams: {
          scheduleStation: 'wnyc-fm939'
        }
      });
    }
  }
});
