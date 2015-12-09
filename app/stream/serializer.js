import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, attributes, id) {
    return {
      data: {
        id,
        type: 'stream',
        attributes
      }
    };
  }

});
