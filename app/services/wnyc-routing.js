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
  transitionTo(routeName, models, queryParams) {
    this.get('_routing').transitionTo(routeName, models, queryParams);
  },

  recognize(url) {
    let handlers = this.get('_routing').router.router.recognizer.recognize(url);
    // recognize returns queryParams as a property on the handlers array
    // seems strange, maybe it's a bug? problems with a private API
    let { queryParams } = handlers;
    // now make it an array
    handlers = Array.from(handlers);
    handlers.shift(); // application handler is always present and not interesting here
    //let routeName = handlers.map(h => h.handler).join('.');
    let routeName = handlers[handlers.length -1].handler;
    let params = [];
    handlers.forEach(h => {
      // Originally the parameters were stripped down to just one param. 
      // Added all params for the schedule-date route and it appears to not break anything
      Object.keys(h.params).forEach(function(keyName) {
        params.push(h.params[keyName]);
      });
    });
    return { routeName, params, queryParams };
  }

});
