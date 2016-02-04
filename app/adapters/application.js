import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
    host: ENV.wnycAPI,
    namespace: 'api/v3',
    // ember 2.0 deprecation
    shouldBackgroundReloadRecord() {
      return false;
    }
});
