import Torii from 'ember-simple-auth/authenticators/torii';
import service from 'ember-service/inject';
import fetch from 'fetch';
import RSVP from 'rsvp';
import config from 'wnyc-web-client/config/environment';

export default Torii.extend({
  torii: service(),
  store: service(),
  session: service(),

  authenticate() {
    // Providers should return the normal data object, as well as
    // an optional userAttrs object that can be provided to
    // createRecord to create a new user
    return new RSVP.Promise((resolve, reject) => {
      this._super(...arguments).then((data) => {
        let authData = {
          access_token: data.accessToken,
          provider: data.provider,
          expires_in: data.expiresIn,
          user_id: data.userId
        };
        // try to login
        fetch(`${config.wnycAuthAPI}/v1/session`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.accessToken}`,
            'X-Provider': data.provider
          }
        })
        .then((response) => {
          // if we can log in, resolve
          if (response && response.ok) {
            resolve(authData);
          // Otherwise, reject
          } else {
            reject(response);
          }
        })
        .catch(reject);
      })
      .catch(reject);
    });
  },
});
