import Route from 'ember-route';
import moment from 'moment';

export default Route.extend({
  redirect(model, {targetName, queryParams}) {
    if (targetName !== 'playlist-daily.date') {
      let year  = moment().format('YYYY');
      let month = moment().format('MMM').toLowerCase();
      let day   = moment().format('DD');
      this.replaceWith('playlist-daily.date', year, month, day, {
        queryParams: {
          scheduleStation: queryParams.scheduleStation || 'wqxr'
        }
      });
    }
  }
});
