import ApplicationAdapter from 'wnyc-web-client/adapters/application';
import config from 'wnyc-web-client/config/environment';

export default ApplicationAdapter.extend({
  buildURL(modelName, id, snapshot, requestType, query) {
    if (requestType !== 'findRecord') {
      return this._super(...arguments);
    }
    let url = `${this.host}/${this.namespace}/${modelName}/${id}/?site=${config.siteSlug}`;
    if (query && Object.keys(query).length) {
      let qp = Object.keys(query).map(k => `${k}=${query[k]}`);
      url += qp.join('&');
    }
    return url;
  }
});
