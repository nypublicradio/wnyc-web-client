import Route from 'ember-route';

export default Route.extend({
  model() {
    return this.get('store').findRecord('bucket', 'wqxr-home');
  }
});
