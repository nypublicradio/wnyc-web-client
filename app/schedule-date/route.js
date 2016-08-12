import Route from 'ember-route';

export default Route.extend({
  templateName: 'djangorendered',
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model({ year, month, day, scheduleStation = 'wnyc-fm939' }) {
    // year, month, day, and scheduleStation will all be available vars
    return this.store.find('django-page', `schedule/${year}/${month}/${day}/?scheduleStation=${scheduleStation}`);
  }
});