import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  googleAds: service(),
  
  titleToken(model) {
    return model.get('title');
  },
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model({ year, month, day, scheduleStation }) {
    // year, month, day, and scheduleStation will all be available vars
    return this.store.findRecord('django-page', `schedule/${year}/${month}/${day}/?scheduleStation=${scheduleStation}`);
  },
  afterModel() {
    this.get('googleAds').doTargeting();
  }
});
