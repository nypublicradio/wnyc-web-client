import Component from 'ember-component';
import service from 'ember-service/inject';
import BetaActionsMixin from 'wqxr-web-client/mixins/beta-actions';
import config from 'wqxr-web-client/config/environment';
import { or } from 'ember-computed';

export default Component.extend(BetaActionsMixin, {
  audio: service(),
  session: service(),
  metrics: service(),
  router: service('wnyc-routing'),
  currentUser: service(),
  donateURL: config.wnycDonateURL,
  classNameBindings: ['showPlayer:sitechrome--player-open'],
  defaultStream:  {slug: 'wqxr', name: 'WQXR New York'},
  preferredStream: or('session.data.user-prefs-active-stream', 'defaultStream'),
  socialIcons: [
    {url: 'http://www.twitter.com/WQXR', icon: 'twitter'},
    {url: 'http://www.facebook.com/WQXRClassical', icon: 'facebook'},
    {url: 'https://www.instagram.com/wqxr_classical/', icon: 'instagram'},
    {url: 'http://www.youtube.com/user/WQXRClassical', icon: 'youtube'},
  ],

  click: function({target}){
    if (target.tagName === "A"){
      //send tracking
      this.get('metrics').trackEvent('GoogleAnalytics', {
        category: 'WQXR Menu',
        action: "Clicked " + target.text,
      });
    }
  },

  actions: {
    routeSearch(val) {
      this.get('router').transitionTo('djangorendered', ['search/'], {"q": val});
    },
  }
});
