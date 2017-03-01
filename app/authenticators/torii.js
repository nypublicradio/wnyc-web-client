import Torii from 'ember-simple-auth/authenticators/torii';
import service from 'ember-service/inject';

export default Torii.extend({
  torii: service(),

  authenticate() {
    return this._super(...arguments).then(data => {
      return {
        access_token: data.accessToken,
        provider: data.provider,
        expires_in: data.expiresIn,
        user_id: data.userId
      };
    });
  },
});
