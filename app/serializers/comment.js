import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload) {
    return {
      data: payload.results.map(result => {
        let id = result.pk;
        delete result.pk;
        return {
          id,
          type: 'comment',
          attributes: result
        };
      })
    };
  }
});
