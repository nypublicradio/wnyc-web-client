/* global FB */
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
    .then((data) => {
      return this.get('authTask').perform(data);
    });
  },

  authTask: task(function * (data) {
    try {
      let permissions = yield this.fbAPI(`/${data.userId}/permissions`);
      data = this.attachPermissions(data, permissions);
      data = decamelizeKeys([data]);
      let response = this.getSession(data.provider, data.accessToken);
      if (response && response.ok) {
        return data;
      } else {
        throw { error: 'Unauthorized', data: data};
      }
    } catch(e) {
      throw {error: 'Unauthorized', data: data};
    }
  }),

  fbAPI(url) {
    return new RSVP.Promise(function(resolve/*, reject*/) {
      FB.api(url, response => resolve(response));
    });
  },

  attachPermissions(data, permissions) { // modifies data
    if (permissions) {
      data.permissions = permissions.data.reduce((result, p) => {
        if (p && p.permission) {
          result[p.permission] = p.status;
        }
        return result;
      }, {});
    }
    return data;
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
