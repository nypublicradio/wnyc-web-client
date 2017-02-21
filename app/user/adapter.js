import ENV from '../config/environment';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
const { keys } = Object;

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAuthAPI,
  buildURL(modelName, id, snapshot, requestType, query) {
    if (/createRecord|updateRecord|deleteRecord/.test(requestType)) {
      return `${this.host}/v1/user`;
    } else if (requestType.startsWith('query')) {
      delete query.me;
      return `${this.host}/v1/session`;
    }
  },
  
  // conform with JSON merge patch strategy: "only send what you need"
  // https://tools.ietf.org/html/rfc7396
  updateRecord(store, type, snapshot) {
    let data = {};
    let serializer = store.serializerFor(type.modelName);
    let url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');
    let changed = keys(snapshot.record.changedAttributes());

    serializer.serializeIntoHash(data, type, snapshot, { includeId: true });
    
    keys(data).forEach(k => {
      if (!changed.includes(k.camelize())) {
        delete data[k];
      }
    });

    return this.ajax(url, 'PATCH', { data: data });
  },
  
  createRecord(store, type, {record, adapterOptions}) {
    // at this point we're still unauthenticated, so we need to manually add
    // required X-Provider and Authorization headers for sign up via third-
    // party providers e.g. facebook
    if (adapterOptions && adapterOptions.provider) {
      this.set('headers', {
        'X-Provider': adapterOptions.provider,
        'Authorization': `Bearer ${record.get('providerToken')}`
      });
    } else {
      this.set('headers', undefined);
    }
    return this._super(...arguments);
  }
});
