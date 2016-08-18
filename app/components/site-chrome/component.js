import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';

export default Ember.Component.extend(BetaActionsMixin, {
  session: service(),
  metrics: service(),
  router: service('wnyc-routing'),
  // we load SVGs via the <use> element, which requires the asset loaded
  // on the same domain
  svgURL: config.wnycSvgURL,
 
  click: function(e){
    if (e.target.tagName === "A"){
      //send tracking
      let text =  e.target.text;
      this.get('metrics').trackEvent({
        category: 'WNYC Menu',
        action: "Clicked " + text,
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
