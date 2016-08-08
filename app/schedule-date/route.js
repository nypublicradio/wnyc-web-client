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

  model(params) {
    console.dir(params);
    console.log("schedule date");
    let year = params.year;
    let month = params.month;
    let day = params.day;
    let station = params.scheduleStation; 
    return this.store.find('django-page', `schedule/${year}/${month}/${day}/?scheduleStation=${station}`);
  }
});