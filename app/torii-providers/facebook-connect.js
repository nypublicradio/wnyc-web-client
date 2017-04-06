import FacebookConnectProvider from 'torii/providers/facebook-connect';
import run from 'ember-runloop';
import RSVP from 'rsvp';

export default FacebookConnectProvider.extend({
  open() {
    return new RSVP.Promise((resolve, reject) => {
      this._super().then((data) => {
        run(() => {
          window.FB.api('/me', {fields: 'first_name,last_name,email,picture.width(500)'}, response => {
            if (!response || response.error) {
              reject(response);
            }
            // collect user attrs from FB api and send to auth
            let userAttrs = {
              providerToken: data.accessToken,
              givenName: response.first_name,
              familyName: response.last_name,
              email: response.email,
              picture: response.picture.data.url,
              facebookId: response.id
            };
            if (response.picture.data.is_silhouette) {
              userAttrs.picture = '';
            }
            data.provider = 'facebook-connect';
            resolve({data, userAttrs});
          });
        });
      });
    });
  },

  fetch(data) {
    return data;
  }
});
