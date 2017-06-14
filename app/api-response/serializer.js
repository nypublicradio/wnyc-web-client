import DS from 'ember-data';
import { dasherizeKeys } from 'wqxr-web-client/story/serializer';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, typeClass, {included = [], data}, id, requestType) {
    included = included.map(r => {
      let { attributes } = r;
      r.attributes = dasherizeKeys(attributes);
      return r;
    });
    return this._super(store, typeClass, {included, data}, id, requestType);
  }
});
