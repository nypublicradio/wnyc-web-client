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
    {url: 'http://www.twitter.com/wnyc', icon: 'twitter'},
    {url: 'http://www.facebook.com/wnyc', icon: 'facebook'},
    {url: 'https://www.instagram.com/wnyc', icon: 'instagram'},
    {url: 'http://wnyc.tumblr.com/', icon: 'tumblr'},
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
