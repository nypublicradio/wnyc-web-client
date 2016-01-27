/*global wnyc*/
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
    host: wnyc.api_url || '',
    namespace: 'api/v3',
    ajaxOptions(url) {
      return {
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'WNYC'
      };
    },
    // ember 2.0 deprecation
    shouldBackgroundReloadRecord() {
      return false
    }
});
