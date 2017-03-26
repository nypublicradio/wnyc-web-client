import Route from 'ember-route';

export default Route.extend({
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
    return this.store.findRecord('django-page', `playlist-daily/${year}/${month}/${day}/?scheduleStation=${scheduleStation}`);
  }
});
