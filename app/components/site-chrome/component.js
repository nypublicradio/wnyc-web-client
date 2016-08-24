import Component from 'ember-component';
import service from 'ember-service/inject';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';
import config from 'overhaul/config/environment';

export default Component.extend(BetaActionsMixin, {
  session: service(),
  metrics: service(),
  router: service('wnyc-routing'),
  donateURL: config.wnycDonateURL,
 
  click: function({target}){
    if (target.tagName === "A"){
      //send tracking
      this.get('metrics').trackEvent({
        category: 'WNYC Menu',
        action: "Clicked " + target.text,
      });
    }
  },

  actions: {
    routeSearch(val) {
      this.get('router').transitionTo('djangorendered', ['search/'], {"q": val});
    },
    logout() {
      this.get('metrics').trackEvent({
        category: 'WNYC Menu',
        label: 'Clicked Logout',
      });
      this.get('session').invalidate();
    }
  }
});
