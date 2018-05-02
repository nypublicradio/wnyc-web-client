import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'wqxr-web-client/config/environment';
import { or } from '@ember/object/computed';

export default Component.extend({
  session: service(),
  metrics: service(),
  router: service(),
  currentUser: service(),
  donateURL: config.wnycDonateURL,
  classNameBindings: ['showPlayer:sitechrome--player-open'],
  preferredStream: or('session.data.user-prefs-active-stream', 'defaultStream'),
  init() {
    this._super(...arguments);
    this.setProperties({
      defaultStream:  {slug: 'wqxr', name: 'WQXR 105.9 FM'},
      socialIcons: [
        {url: 'http://www.twitter.com/WQXR', icon: 'twitter'},
        {url: 'http://www.facebook.com/WQXRClassical', icon: 'facebook'},
        {url: 'https://www.instagram.com/wqxr_classical/', icon: 'instagram'},
        {url: 'http://www.youtube.com/user/WQXRClassical', icon: 'youtube'},
      ]
    });
  },
  actions: {
    routeSearch(val) {
      this.get('router').transitionTo('djangorendered', 'search/', {queryParams: {q: val}});
    },
  }
});
