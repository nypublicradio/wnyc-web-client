import Route from 'ember-route';

export default Route.extend({
  templateName: 'djangorendered',
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model(params) {
    let year = params.year;
    let month = params.month;
    let day = params.day;
    let station = params.scheduleStation || "wnyc-fm939"; 
    return this.store.find('django-page', `schedule/${year}/${month}/${day}/?scheduleStation=${station}`);
  }
});