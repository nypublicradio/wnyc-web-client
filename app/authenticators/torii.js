import Torii from 'ember-simple-auth/authenticators/torii';
import service from 'ember-service/inject';
import fetch from 'fetch';
import RSVP from 'rsvp';
import config from 'wnyc-web-client/config/environment';
import { decamelizeKeys } from 'wnyc-web-client/helpers/decamelize-keys';
import { task } from 'ember-concurrency';

export default Torii.extend({
  torii: service(),

  authenticate() {
    return this._super(...arguments)
    .then(providerData => {
      return new RSVP.Promise(resolve => {
        let user = this.get('authenticateSession').perform(providerData);
        resolve(user);
      });
    });
  },

  authenticateSession: task(function * (data) {
    let response = yield this.getSession(data.provider, data.accessToken);
    if (response) {
      if (response.ok) {
        return decamelizeKeys([data]);
      } else if (response.status < 500) {
        return RSVP.reject(response.json());
      } else {
        return RSVP.reject({ "errors": {"code": "serverError"} });
      }
    }
  }),

  getSession(provider, accessToken) {
    return fetch(`${config.wnycAuthAPI}/v1/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Provider': provider
      }
    });
  }
});
