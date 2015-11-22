import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload) {
    return {
      data: payload.results.map(result => {
        let id = result.id;
        delete result.id;
        return {
          id,
          type: 'comment',
          attributes: result
        };
      })
    };
  }
});
