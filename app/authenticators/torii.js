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
      this._super(...arguments).then(({data, userAttrs}) => {
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
          // if we get a 401 Unauthorized, create a user
          } else if (response && response.status === 401 && userAttrs) {
            // flag to trigger a notification for new users
            // not set on session.data because we don't want to persist it
            this.get('session').set('isNewSocialUser', true);
            let user = this.get('store').createRecord('user', userAttrs);
            user.save({adapterOptions: {provider: data.provider}})
            .then(() => resolve(authData))
            .catch(reject);
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
