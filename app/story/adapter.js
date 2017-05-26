import ENV from '../config/environment';
import DS from 'ember-data';
import wrapAjax from 'wnyc-web-client/lib/wrap-ajax';
// TODO: auth headers for native fetch
// import fetch from 'fetch';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAPI,
  pathForType: () => 'story/',
  namespace: 'api/v3',
  // query(store, type, {itemId, uslug, limit, ordering}) {
  //   if (itemId) {
  //     let url = [this.host, this.namespace, 'v2/related', itemId, `?limit=${limit}`].join('/');
  //     let options = this.ajaxOptions(url, 'GET', {});
  //     // Django isn't setup to honor XHR requests at the related stories endpoint,
  //     // so just use the jQuery JSONp for now
  //     if (ENV.environment === 'production') {
  //       options.dataType = 'jsonp';
  //       options.jsonpCallback = 'RELATED';
  //       options.cache = true;
  //     } 
  //     return wrapAjax(options);
  //   } else if (uslug) {
  //     let url = `${this.host}/${this.namespace}/v3/story/?uslug=${uslug}&`
  //   }
  // },
  findRecord(store, type, id/*, snapshot*/) {
    var url = [this.host, 'api/v3', 'story', 'detail', id].join('/') + '/';
    let options = this.ajaxOptions(url, 'GET', {});
    return wrapAjax(options);
  }
});
