import Route from 'ember-route';
import service from 'ember-service/inject';

export default Route.extend({
  poll: service(),
  
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
    return this.store.findRecord('django-page', `playlist-daily/${year}/${month}/${day}/?scheduleStation=${scheduleStation}`, {reload: true});
  },
  
  actions: {
    didTransition() {
      this.get('poll').addPoll({
        interval: 60 * 1000 * 5,
        callback: () => this.refresh(),
        label: 'refresh'
      });
    },
    willTransition() {
      this.get('poll').clearPollByLabel('refresh');
    }
  }
});
