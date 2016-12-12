import ENV from '../config/environment';
import DS from 'ember-data';
import wrapAjax from 'wnyc-web-client/lib/wrap-ajax';
// TODO: auth headers for native fetch
// import fetch from 'fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  namespace: 'api/v2',
  query(store, type, query) {
    let url = [this.host, this.namespace, 'related', query.itemId, `?limit=${query.limit}`].join('/');
    let options = this.ajaxOptions(url, 'GET', {});
    // Django isn't setup to honor XHR requests at the related stories endpoint,
    // so just use the jQuery JSONp for now
    if (ENV.environment === 'production') {
      options.dataType = 'jsonp';
      options.jsonpCallback = 'RELATED';
      options.cache = true;
    }
    return wrapAjax(options);
  },
  findRecord(store, type, id/*, snapshot*/) {
    var url = [this.host, 'api/v3', 'story', 'detail', id].join('/') + '/';
    let options = this.ajaxOptions(url, 'GET', {});
    return wrapAjax(options);
  }
});
