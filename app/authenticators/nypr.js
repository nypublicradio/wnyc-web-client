import config from 'wqxr-web-client/config/environment';
import OAuth2PasswordGrantAuthenticator from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrantAuthenticator.extend({
  serverTokenEndpoint: `${config.wnycAuthAPI}/v1/session`
});
