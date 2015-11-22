import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload, id) {
    return {
      data: {
        id,
        type: 'browser-id',
        attributes: {
          identity: payload.id
        }
      }
    };
  }
});
