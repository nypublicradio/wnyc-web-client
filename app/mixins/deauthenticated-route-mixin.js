import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';

// Invalidates an authenticated session,
// but sets a flag to not refresh the page.
//
// This is for routes where the user is presented
// with a login form after some sort of token check
// such as /validate, and /reset
//
// The user should be logged out so they can log in with their own account,
// but we still want to stay on the route.
export default Mixin.create({
  session: service(),

  beforeModel() {
    if (get(this, 'session.isAuthenticated')) {
      // we check for the noRefresh flag on
      // sessionInvalidated() on the application route
      set(this, 'session.noRefresh', true);
      get(this, 'session').invalidate();
    }
    this._super(...arguments);
  }
});
