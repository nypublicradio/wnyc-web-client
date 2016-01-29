import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute(key) { return key },
  normalizeResponse(store, primaryModelClass, payload) {
    return {
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
  }
});
