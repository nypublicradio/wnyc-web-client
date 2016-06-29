import Ember from 'ember';
import config from 'overhaul/config/environment';

let { wnycURL } = config;

export default Ember.Mixin.create({
  actions: {
    enterBeta() {
      let id = this.get('beta.id');
      location.assign(`${wnycURL}/?wnyc_trial_${id}_interaction=True`);
    },
    dismissBeta(id) {
      Ember.$.ajax(`${wnycURL}/?wnyc_trial_${id}_interaction=False`, {
        xhrFields: {withCredentials: true}
      });
    },
    exitBeta() {
      let id = this.get('beta.id');
      location.assign(`${wnycURL}/?wnyc_trial_${id}_interaction=False`);
    }
  }
});
