import Component from 'ember-component';
import computed, { or } from 'ember-computed';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  cookies: service(),

  /* settings */
  id: '',
  showAgain: new Date(),
  dismissUntil: new Date(),

  dismissedNow: false,
  dismissedBefore: computed('cookies', 'id', function() {
    let cookies = get(this, 'cookies').read();
    let id = get(this, 'id');
    return `${id}-dismissed` in cookies;
  }),
  seeingNow: false,
  seenBefore: computed('cookies', 'cookieName', function() {
    let cookies = get(this, 'cookies').read();
    let id = get(this, 'id');
    return `${id}-seen` in cookies;
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
      let id = get(this, 'id');
      let expires = get(this, 'showAgain').toUTCString();
      if (id) {
        if (!get(this, 'seenBefore')) {
          set(this, 'seeingNow', true);
          cookies.write(`${id}-seen`, 'true', {expires});
        }
      }
  },

  actions: {
    dismiss() {
      let cookies = get(this, 'cookies');
      let id = get(this, 'id');
      let expires = get(this, 'dismissUntil').toUTCString();

      cookies.write(`${id}-dismissed`, 'true', {expires});
      set(this, 'dismissedNow', true);
    }
  }
});
