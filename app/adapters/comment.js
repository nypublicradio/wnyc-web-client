import ENV from '../config/environment';
import DS from 'ember-data';
import wrapAjax from 'wnyc-web-client/lib/wrap-ajax';
// TODO: auth headers for native fetch
// import fetch from 'fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  namespace: `api/v1/list/comments`,
  
  query(store, type, query) {
    let url = [this.host, this.namespace, query.itemTypeId, query.itemId, ''].join('/');
    let options = this.ajaxOptions(url, 'GET', {});
    return wrapAjax(options);
  }
});
