import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.JSONAPIAdapter.extend({
    namespace: 'api/v3',
    host: ENV.wnycAPI,
    ajaxOptions(url) {
      return {
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'WNYC'
      };
    },
    // ember 2.0 deprecation
    shouldBackgroundReloadRecord() {
      return false;
    }
});
