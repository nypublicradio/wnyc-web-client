import Ember from 'ember';
import fetch from 'fetch';
import { later } from 'ember-runloop';

export default Ember.Component.extend({
  target: null,
  email: null,
  ready: true,
  success: false,
  error: false,
  autoReset: true,
  resetDelay: 10000,
  successMessage: 'Email resent',
  errorMessage: 'Email not resent',
  actions: {
    resend(target, email) {
      let delay = this.get('resetDelay');
      let reset = this.reset;
      fetch(`${target}?email=${email}`, {method: 'GET', mode: 'cors'})
        .then((response) => {
          this.set('ready', false);
          if (response.ok) {
            this.set('success', true);
          } else {
            this.set('error', true);
          }
          if (this.get('autoReset')) {
            later(this, reset, delay);
          }
        })
        .catch(() => {
          this.set('ready', false);
          this.set('error', true);
          if (this.get('autoReset')) {
            later(this, reset, delay);
          }
        });
    }
  },
  reset() {

    this.set('success', false);
    this.set('error', false);
    this.set('ready', true);
  }
});
