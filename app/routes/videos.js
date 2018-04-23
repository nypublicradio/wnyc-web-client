import Route from '@ember/routing/route';


export default Route.extend({
  titleToken(model) {
    return model.get('title');
  },
  model() {
    return this.store.findRecord('django-page', 'videos/');
  }
});
