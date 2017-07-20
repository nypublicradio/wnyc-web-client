import ApplicationAdapter from 'wnyc-web-client/adapters/application';
import config from 'wnyc-web-client/config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    let url = this._super(...arguments);
    if (requestType !== 'findRecord') {
      return url;
    }
    url += `/?site=${config.siteSlug}`;
    if (query && Object.keys(query).length) {
      let qp = Object.keys(query).map(k => `${k}=${query[k]}`);
      url += qp.join('&');
    }
    return url;
  }
});
