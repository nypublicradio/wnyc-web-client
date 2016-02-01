import DS from 'ember-data';
import ENV from '../config/environment';
import Ember from 'ember';
import fetch from 'fetch';

const { Promise } = Ember.RSVP;

export default DS.JSONAPIAdapter.extend({
  findRecord() {
    let id;
    if (window.localStorage && (id = window.localStorage.browserId)) {
      getBrowserId(id);
      return Promise.resolve({ id });
    }
    return getBrowserId().then(payload => {
      if (window.localStorage) {
        window.localStorage.browserId = payload.id;
      }
      return payload;
    });
  }
});

function getBrowserId(knownId) {
  let url = ENV.wnycEtagAPI;
  let headers = {};

  if (knownId) {
    headers['X-WNYC-BrowserId'] = knownId;
  }

  return fetch(url, {
    credentials: 'include',
    headers
  }).then(checkStatus)
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
