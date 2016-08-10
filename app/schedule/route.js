import Route from 'ember-route';
import moment from 'moment';

export default Route.extend({
  templateName: 'djangorendered',
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
 
  model() {
    let todaysSchedule = `schedule/${moment().format('YYYY/MMM/DD').toLowerCase()}/?scheduleStation=wnyc-fm939`;
    return this.store.find('django-page', todaysSchedule);
  }
});