import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({
  redirect(model, { params }) {
    let year  = moment().format('YYYY');
    let month = moment().format('MMM').toLowerCase();
    let day   = moment().format('DD');
    this.transitionTo(`djangorendered`,`playlist-daily/${year}/${month}/${day}`, {
      queryParams: { scheduleStation: params.playlist.slug }
    });
  }
});
