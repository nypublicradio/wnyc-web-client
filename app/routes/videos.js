import Route from 'ember-route';

export default Route.extend({
  titleToken(model) {
    return model.get('title');
  },
  templateName: 'djangorendered',
  model() {
    return this.store.findRecord('django-page', 'videos/');
  }
});
