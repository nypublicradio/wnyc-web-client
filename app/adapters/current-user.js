import DS from 'ember-data';
import Ember from 'ember';
import fetch from 'fetch';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
  findRecord(store) {
    let user = store.peekRecord('current_user', 'current');
    if (!user) {
      return fetch(ENV.wnycAccountRoot + `/api/v1/is_logged_in/?bust_cache=${Math.random()}`, {
        credentials: 'include'
      }).then(checkStatus)
        .then(response => response.json());
    } else {
      return Ember.RSVP.Promise.resolve({ user });
    }
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
