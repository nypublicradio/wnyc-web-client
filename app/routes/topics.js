import Route from 'ember-route';

export default Route.extend({
  titleToken: 'Browse Stories by Category or Topic',
  templateName: 'djangorendered',
  model() {
    return this.store.find('django-page', 'topics/');
  }
});
