import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, {results}, id, requestType) {
    if (results) {
      let transformed = {
        data: results.map(result => {
          let id = result.id;
          delete result.id;

          let attributes = {};
          Object.keys(result).forEach(key => attributes[key.dasherize()] = result[key]);

          return {
            id,
            type: 'story',
            attributes
          };
        })
      };
      return this._super(store, primaryModelClass, transformed, id, requestType);
    } else {
      return this._super(...arguments);
    }
  }
});
