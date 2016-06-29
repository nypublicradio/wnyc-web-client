import Ember from 'ember';
import ApplicationAdapter from '../adapters/application';

export default ApplicationAdapter.extend({
  pathForType() {
    return 'channel';
  },
  ajaxOptions(urlToDecode, type, options = {}) {
    const url = decodeURIComponent(urlToDecode);

    return Ember.assign(options, {
      url: url.slice(-1) === '/' ? `${url}/` : url,
      dataType: 'jsonp',
      jsonpCallback: 'WNYC'
    });
  }
});
