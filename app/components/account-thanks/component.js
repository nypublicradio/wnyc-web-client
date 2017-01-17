import Component from 'ember-component';
import ENV from 'wnyc-web-client/config/environment';

export default Component.extend({
  resendEndpoint: `${ENV.wnycAuthAPI}/v1/confirm/resend`,
});
