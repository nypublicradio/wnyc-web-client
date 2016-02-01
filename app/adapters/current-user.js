import DS from 'ember-data';
import fetch from 'fetch';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  findRecord() {
    return fetch(ENV.wnycAccountAPI + '/api/v1/is_logged_in/', {
      credentials: 'include'
    }).then(checkStatus)
      .then(response => response.json());
  }
});

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
