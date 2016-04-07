import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('alienDomClick', function(app, selector) {
  let router = this.__container__.lookup('router:main');
  let el = document.querySelector(selector);
  el.click();
  return new Ember.RSVP.Promise(function(resolve) {
    router.on('didTransition', function() {
      resolve();
    });
  });
});
