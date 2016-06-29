import config from 'overhaul/config/environment';
import Base from 'ember-simple-auth/authenticators/base';
import $ from 'jquery';
import RSVP from 'rsvp';
import service from 'ember-service/inject';

export default Base.extend({
  session: service(),

  restore(user) {
    this.get('session').set('attemptedTransition', null);
    return RSVP.Promise.resolve(user);
  },

  authenticate(username, password) {
    return new RSVP.Promise((resolve, reject) => {
      return $.ajax(`${config.wnycAccountRoot}/api/v1/accounts/login/`, {
        data: {
          username,
          password
        },
        method: 'POST',
        xhrFields: { withCredentials: true }
      })
      .then(json => checkAuthentication(json, resolve, reject));
    });
  },

  invalidate(/* data */) {
    let browserId = this.get('session.data.browserId');
    return new RSVP.Promise((resolve, reject) => {
      return $.ajax(`${config.wnycAccountRoot}/api/v1/accounts/logout/?bust_cache=${Math.random()}&id=${browserId}`, {
        method: 'POST',
        xhrFields: { withCredentials: true }
      })
      .then(({successful_logout}) => {
        if (successful_logout) {
          resolve();
        } else {
          reject();
        }
      });
    });
  },
});

function checkAuthentication({success, errors}, resolve, reject) {
  if (success) {
    return getUserData().then(json => {
      if (!json.isAuthenticated) {
        reject("Invalid credentials");
      } else {
        resolve(json);
      }
    });
  } else if (errors) {
    if (errors.__all__) {
      return reject(errors.__all__);
    }
    let fields = Object.keys(errors);
    return reject(fields.map(f => `${f} is required`));
  }
}

export function getUserData() {
  return $.ajax(`${config.wnycAccountRoot}/api/v1/is_logged_in/`, {
    data: {
      bust_cache: Math.random()
    },
    xhrFields: { withCredentials: true }
  });
}
