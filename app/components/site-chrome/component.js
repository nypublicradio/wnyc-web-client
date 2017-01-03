import Component from 'ember-component';
import service from 'ember-service/inject';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';
import config from 'overhaul/config/environment';
import { or } from 'ember-computed';

export default Component.extend(BetaActionsMixin, {
  audio: service(),
  session: service(),
  metrics: service(),
  router: service('wnyc-routing'),
  classNameBindings: ['chromeDisabled'],
  donateURL: config.wnycDonateURL,
  defaultStream:  {slug: 'wnyc-fm939', name: 'WNYC 93.9 FM'},
  preferredStream: or('session.data.user-prefs-active-stream', 'defaultStream'),

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
