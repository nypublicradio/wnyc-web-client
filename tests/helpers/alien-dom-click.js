import { Promise as EmberPromise } from 'rsvp';
import { registerAsyncHelper } from '@ember/test';

export default registerAsyncHelper('alienDomClick', function(app, selector) {
  let router = this.__container__.lookup('router:main');
  let el = document.querySelector(selector);
  el.click();
  return new EmberPromise(function(resolve) {
    router.on('didTransition', function() {
      resolve();
    });
  });
});
