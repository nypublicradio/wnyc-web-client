import Route from 'ember-route';

export default Route.extend({
  titleToken(model) {
    return model.get('title');
  },
  model({url_path}) {
    return this.store.findRecord('django-page', `events/${url_path}`.replace(/\/*$/, '/'));
  }
});
