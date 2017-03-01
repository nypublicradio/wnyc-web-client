import OAuth2Bearer from 'ember-simple-auth/authorizers/oauth2-bearer';
import { isEmpty } from 'ember-utils';

export default OAuth2Bearer.extend({
  authorize(data, block) {
    this._super(...arguments);
    
    let { provider } = data;
    if (!isEmpty(provider)) {
      block('X-Provider', provider);
    }
  }
});
