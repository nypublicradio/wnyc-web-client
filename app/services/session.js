import SessionService from 'ember-simple-auth/services/session';
import config from 'wnyc-web-client/config/environment';
import run from 'ember-runloop';
import RSVP from 'rsvp';
import service from 'ember-service/inject';
import fetch from 'fetch';
import getOwner from 'ember-owner/get';

export default SessionService.extend({
  store: service(),

  syncBrowserId(report = true) {
    let legacyId;
    try {
      legacyId = window.localStorage.getItem('browserId');
      if (legacyId) {
        // some clients save their browserId with quotes
        legacyId = legacyId.replace(/"/g, '');
        // TODO: when other clients update to ESA, we can get rid of this key
        window.localStorage.setItem('browserId', legacyId);
      }
    } catch(e) {
      if (e.name === "SecurityError") {
        console.warn("Cookies are disabled. No local settings allowed.");
        return RSVP.Promise.resolve(null);
      }
    }

    let { browserId } = this.get('data');
    if (legacyId || browserId) {
      if (report) {
        reportBrowserId(legacyId || browserId);
      }
      // some clients save their browserId with quotes
      this.set('data.browserId', (legacyId || browserId).replace(/"/g, ''));
    } else {
      getBrowserId()
        .then( ({ browser_id }) => this.set('data.browserId', browser_id));
    }
  },

  staffAuth() {
    fetch(`${config.wnycAdminRoot}/api/v1/is_logged_in/?bust_cache=${Math.random()}`, {
      credentials: 'include'
    })
    .then(checkStatus).then(r => r.json())
    .then(({is_staff, name}) => {
      this.setProperties({
        'data.isStaff': is_staff,
        'data.staffName': name
      });
    });
  },

  verify(email, password) {
    let authenticator = getOwner(this).lookup('authenticator:nypr');
    return authenticator.authenticate(email, password);
  },

  createUserForAuthenticatedProvider() {
    let provider = this.get('data.authenticated.provider');
    let access_token = this.get('data.authenticated.access_token');
    if (provider === 'facebook-connect') {
      return new RSVP.Promise((resolve, reject) => {
        run(() => {
          window.FB.api('/me', {fields: 'first_name,last_name,email,picture.width(500)'}, response => {
            if (!response || response.error) {
              reject(response);
            }
            // collect user attrs from FB api and send to auth
            let attrs = {
              providerToken: access_token,
              givenName: response.first_name,
              familyName: response.last_name,
              email: response.email,
              picture: response.picture.data.url,
              facebookId: response.id
            };
            let user = this.get('store').createRecord('user', attrs);
            user.save({adapterOptions: {provider: 'facebook-connect'}});
            resolve(user);
          });
        });
      });
    } else {
      return RSVP.reject({});
    }
  }
});

function reportBrowserId(knownId) {
  fetch(config.wnycEtagAPI, {
    headers: { 'X-WNYC-BrowserId': knownId }
  });
}

function getBrowserId() {
  return fetch(config.wnycEtagAPI)
    .then(checkStatus)
    .then(response => response.json());
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
