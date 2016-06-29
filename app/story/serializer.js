import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(key) { return key; },
  payloadKeyFromModelName() { return 'story'; },
  normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
    let transformed = {
      data: payload.results.map(result => {
        let id = result.id;
        delete result.id;
        return {
          id,
          type: 'story',
          attributes: result
        };
      })
    };
    return this._super(store, primaryModelClass, transformed, id, requestType);
  }
});
