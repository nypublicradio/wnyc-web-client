import Torii from 'ember-simple-auth/authenticators/torii';
import service from 'ember-service/inject';
import fetch from 'fetch';
import RSVP from 'rsvp';
import config from 'wqxr-web-client/config/environment';
import { decamelizeKeys } from 'wqxr-web-client/helpers/decamelize-keys';

export default Torii.extend({
  torii: service(),
  authenticate() {
    return this._super(...arguments)
    .then((data) => {
      return RSVP.all([
        data,
        this.fbAPI(`/${data.userId}/permissions`)
      ]);
    })
    .then(([data, permissions]) => {
      if (permissions) {
        data.permissions = permissions.data.reduce((result, p) => {
          if (p && p.permission) {
            result[p.permission] = p.status;
          }
          return result;
        }, {});
      }
      return RSVP.all([
        data,
        this.getSession(data.provider, data.accessToken)
      ]);
    })
    .then(([data, response]) => {
      data = decamelizeKeys([data]);
      if (response && response.ok) {
        return data;
      } else {
        return RSVP.reject(response, data);
      }
    });
  },

  fbAPI(url) {
    return new RSVP.Promise(function(resolve, reject) {
      FB.api(url, response => resolve(response));
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
