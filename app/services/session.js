import SessionService from 'ember-simple-auth/services/session';
import config from 'overhaul/config/environment';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default SessionService.extend({
  syncBrowserId(report = true) {
    let { browserId } = this.get('data');
    if (browserId) {
      if (report) {
        reportBrowserId(browserId);
      }
      return RSVP.Promise.resolve(browserId);
    }

    return getBrowserId().then( ({ browser_id }) => {
      this.set('data.browserId', browser_id);
      return browser_id;
    });
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
