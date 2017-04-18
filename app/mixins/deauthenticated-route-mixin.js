import Ember from 'ember';
import service from 'ember-service/inject';
import set from 'ember-metal/set';
import get from 'ember-metal/get';

// Invalidates an authenticated session,
// but sets a flag to not refresh the page.
//
// This is for routes where the user is presented
// with a login form after some sort of token check
// such as /validate, and /reset
//
// The user should be logged out so they can log in with their own account,
// but we still want to stay on the route.
export default Ember.Mixin.create({
  session: service(),

  beforeModel() {
    if (get(this, 'session.isAuthenticated')) {
      // we check for the noRefresh flag on
      // sessionInvalidated() on the application route
      set(this, 'session.noRefresh', true);
      get(this, 'session').invalidate();
    }
  }
});
