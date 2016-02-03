import Ember from 'ember';
import ApplicationAdapter from '../adapters/application';

const {
  RSVP,
  merge,
  run
} = Ember;

export default ApplicationAdapter.extend({
  pathForType() {
    return 'channel';
  },
  ajaxOptions(urlToDecode, type, options = {}) {
    const url = decodeURIComponent(urlToDecode);

    return merge(options, {
      url: url.slice(-1) === '/' ? `${url}/` : url,
      dataType: 'jsonp',
      jsonpCallback: 'WNYC'
    });
  },

  findRecord(store, type, id/*, snapshot*/) {
    let listing = window.wnyc.listing;

    if (listing && listing[id]) {
      return new RSVP.Promise(resolve => run(null, resolve, listing[id]));
    }
    return this._super(...arguments);
  }
});
