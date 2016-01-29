import ApplicationAdapter from '../adapters/application';
import service from 'ember-service/inject';
import {calculateOffset} from '../utils/math-util';
import Ember from 'ember';

const {
  merge,
  RSVP,
  run,
  get
} = Ember;

export default ApplicationAdapter.extend({
  pageNumbers: service(),
  pathForType() {
    return 'channel'
  },
  buildURL(modelName, id/*, snapshot, requestType, query*/) {
    const urlParts = id.split('/')
    if (!/^\d+$/.test(get(urlParts, 'lastObject'))) {
      // the last url part is not a page number, no offset to calculate
      return id
    }
    const pageNumber = urlParts.pop()
    const limit = get(this, 'pageNumbers.perPage')
    const offset = calculateOffset(pageNumber, limit)
    return `${urlParts.join('/')}/?offset=${offset}&limit=${limit}`
  },
  ajaxOptions(pathWithParams, type, options = {}) {
    const [path, data] = decodeURIComponent(pathWithParams).split('?')
    const url = `${this.host}/${this.namespace}/${this.pathForType()}/${path}`

    return merge(options, {
      url,
      data,
      dataType: 'jsonp',
      jsonpCallback: 'WNYC'
    })
  },
  findRecord(store, type, id/*, snapshot*/) {
    // TODO: update server to print JSON key in /id/pagenumber format
    const transformedId = this.buildURL(null, id)

    const preloaded = get(wnyc, `listing.pageOne.${transformedId}`)

    if (preloaded) {
      return new RSVP.Promise(resolve => run(null, resolve, preloaded))
    }
    return this._super(...arguments)
  },
});
