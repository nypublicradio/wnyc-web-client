import Route from 'ember-route';

export default Route.extend({
  templateName: 'djangorendered',

  model() {
    return this.store.find('django-page', 'topics/');
  }
});