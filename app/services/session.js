import SessionService from 'ember-simple-auth/services/session';
import config from 'wnyc-web-client/config/environment';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default SessionService.extend({
  syncBrowserId(report = true) {
    let legacyId;
    try {
      legacyId = window.localStorage.getItem('browserId');
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
      return RSVP.Promise.resolve(legacyId || browserId)
        .then(id => this.set('data.browserId', id));
    }

    return getBrowserId()
      .then( ({ browser_id }) => this.set('data.browserId', browser_id));
  }
});

function reportBrowserId(knownId) {
  return fetch(config.wnycEtagAPI, {
    headers: { 'X-WNYC-BrowserId': knownId }
  }).then(checkStatus)
    .then(response => response.json());
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
