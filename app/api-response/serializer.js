import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, typeClass, payload, id, requestType) {
    payload.included = payload.included || [];
    payload.included = payload.included.map(r => {
      let { attributes, type, id, relationships } = r;
      // story serializer expects keys dasherized
      let attrs = {};
      if (attributes) {
        Object.keys(attributes).forEach(k => attrs[k.dasherize()] = attributes[k]);
      }
      return {type, id, attributes: attrs, relationships};
    });
    return this._super(store, typeClass, payload, id, requestType);
  }
});
