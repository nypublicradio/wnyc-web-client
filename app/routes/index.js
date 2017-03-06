import Route from 'ember-route';

export default Route.extend({
  classNames: ['home'],

  model() {
    return this.get('store').findRecord('bucket', 'wqxr-home');
  }
});
