import SessionService from 'ember-simple-auth/services/session';
import config from 'wnyc-web-client/config/environment';
import fetch from 'fetch';

export default SessionService.extend({
  syncBrowserId(report = true) {
    let legacyId = window.localStorage.getItem('browserId');
    let { browserId } = this.get('data');
    if (legacyId || browserId) {
      if (report) {
        reportBrowserId(legacyId || browserId);
      }
      this.set('data.browserId', legacyId || browserId);
    } else {
      getBrowserId()
        .then( ({ browser_id }) => this.set('data.browserId', browser_id));
    }
  },
  
  staff() {
    fetch(`${config.wnycAccountRoot}/api/v1/is_logged_in/?bust_cache=${Math.random()}`, {
      credentials: 'include'
    })
    .then(checkStatus).then(r => r.json())
    .then(({is_staff}) => this.set('data.isStaff', is_staff));
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
