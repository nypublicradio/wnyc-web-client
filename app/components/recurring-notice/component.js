import Component from 'ember-component';
import computed, { or } from 'ember-computed';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  cookies: service(),

  /* settings */
  name: '',
  showAgain: new Date(),
  dismissUntil: new Date(),

  dismissedNow: false,
  dismissedBefore: computed('cookies', 'name', function() {
    let cookies = get(this, 'cookies').read();
    let name = get(this, 'name');
    return `${name}-dismissed` in cookies;
  }),
  seeingNow: false,
  seenBefore: computed('cookies', 'cookieName', function() {
    let cookies = get(this, 'cookies').read();
    let name = get(this, 'name');
    return `${name}-seen` in cookies;
  }),
  seen: computed('seeingNow', 'seenBefore', function() {
    let seeingNow = get(this, 'seeingNow');
    let seenBefore = get(this, 'seenBefore');
    return seenBefore && !seeingNow;
  }),
  dismissed: or('dismissedNow', 'dismissedBefore'),
  seenOrDismissed: or('seen', 'dismissed'),

  didReceiveAttrs() {
      let cookies = get(this, 'cookies');
      let name = get(this, 'name');
      let expires = get(this, 'showAgain');

      if (name) {
        if (!get(this, 'seenBefore')) {
          set(this, 'seeingNow', true);
          cookies.write(`${name}-seen`, 'true', {expires});
        }
      }
  },

  actions: {
    dismiss() {
      let cookies = get(this, 'cookies');
      let name = get(this, 'name');
      let expires = get(this, 'dismissUntil');

      cookies.write(`${name}-dismissed`, 'true', {expires});
      set(this, 'dismissedNow', true);
    }
  }
});
