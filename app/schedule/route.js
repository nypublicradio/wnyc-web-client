import Route from 'ember-route';
import ENV from 'overhaul/config/environment';
import moment from 'moment';
import { canonicalize } from 'overhaul/services/script-loader';
import { assign } from 'overhaul/lib/alien-dom';
import { or } from 'ember-computed';

export default Route.extend({
  templateName: 'djangorendered',
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
 
  model() {
    console.log("schedule");
    let todaysSchedule = `schedule/${moment().format('YYYY/MMM/DD').toLowerCase()}/?scheduleStation=wnyc-fm939`;
    return this.store.find('django-page', todaysSchedule);
  }
});