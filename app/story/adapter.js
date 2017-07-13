import ENV from '../config/environment';
import DS from 'ember-data';
import wrapAjax from 'wqxr-web-client/lib/wrap-ajax';
// TODO: auth headers for native fetch
// import fetch from 'fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  namespace: 'api/v3',
  pathForType: () => 'story',
  buildURL() {
    return this._super(...arguments) + '/';
  },
  urlForFindRecord(id) {
    if (/^\d+$/.test(id)) {
      return `${this.host}/${this.namespace}/story-pk/${id}`;
    } else {
      return this._super(...arguments);
    }
  },
  query(store, type, {related}) {
    if (related) {
      let url = `${this.host}/${this.namespace}/story/related/?limit=${related.limit}&related=${related.itemId}`;
      let options = this.ajaxOptions(url, 'GET', {});
      return wrapAjax(options);
    } else {
      return this._super(...arguments);
    }
  },
  ajaxOptions(url, method, hash) {
    hash = hash || {};
    hash.crossDomain = true;
    hash.xhrFields = {
      withCredentials: true
    };
    return this._super(url, method, hash);
  }
});
