import Torii from 'ember-simple-auth/authenticators/torii';
import service from 'ember-service/inject';
import fetch from 'fetch';
import RSVP from 'rsvp';
import config from 'wqxr-web-client/config/environment';
import { decamelizeKeys } from 'wqxr-web-client/helpers/decamelize-keys';

export default Torii.extend({
  torii: service(),

  authenticate() {
    return new RSVP.Promise((resolve, reject) => {
      return this._super(...arguments)
      .then((data) => {
        return RSVP.all([
          data,
          this.getSession(data.provider, data.accessToken)
        ]);
      })
      .then(([data, response]) => {
        if (response) {
          if (response.ok) {
            resolve(decamelizeKeys([data]));
          } else if (response.status < 500) {
            response.json().then(reject);
          } else {
            reject({ "errors": {"code": "serverError"} });
          }
        }
      }).catch(reject);
    });
  },

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
