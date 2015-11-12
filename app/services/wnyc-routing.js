/*
   Ember doesn't expose a public router service yet, but it will soon,
   and it's really convenient to have in a component-centric
   world. This encapsulates some use of private API to give us the
   benefits now, with an easy upgrade path to the future solution.

   See also https://github.com/emberjs/rfcs/pull/95
*/
import Ember from 'ember';

export default Ember.Service.extend({
  _routing: Ember.inject.service('-routing'),
  transitionTo(routeName, ...models) {
    this.get('_routing').transitionTo(routeName, models);
  }
});
