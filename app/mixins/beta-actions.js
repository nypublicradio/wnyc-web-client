import Ember from 'ember';
import config from 'wnyc-web-client/config/environment';

let { webRoot } = config;

export default Ember.Mixin.create({
  actions: {
    enterBeta() {
      let id = this.get('beta.id');
      location.assign(`${webRoot}/?wnyc_trial_${id}_interaction=True`);
    },
    dismissBeta(id) {
      Ember.$.ajax(`${webRoot}/?wnyc_trial_${id}_interaction=False`, {
        xhrFields: {withCredentials: true}
      });
    },
    exitBeta() {
      let id = this.get('beta.id');
      location.assign(`${webRoot}/?wnyc_trial_${id}_interaction=False`);
    }
  }
});
