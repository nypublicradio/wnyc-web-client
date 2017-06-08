import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  extractId: (modelClass, {attributes}) => attributes.slug,
  normalizeResponse(store, klass, payload/*, id, requestType*/) {
    // these are not actual ember models; need to camelize for consumption by components
    payload.data.attributes['bucket-items'].forEach(item => {
      let { attributes } = item;
      item.attributes = {};
  
      Object.keys(attributes)
        .forEach(k => item.attributes[k.camelize()] = attributes[k]);
    });
    return this._super(...arguments);
  }
});
