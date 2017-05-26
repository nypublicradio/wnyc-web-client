import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  // normalizeQueryResponse(store, primaryModelClass, payload, id, requestType) {
  //   let transformed = {
  //     data: payload.results.map(result => {
  //       let id = result.id;
  //       delete result.id;
  //       
  //       let attributes = {};
  //       Object.keys(result).forEach(key => attributes[key.dasherize()] = result[key]);
  //       
  //       return {
  //         id,
  //         type: 'story',
  //         attributes
  //       };
  //     })
  //   };
  //   return this._super(store, primaryModelClass, transformed, id, requestType);
  // }
  normalizeQueryResponse(store, modelClass, payload) {
    const result = this._super(...arguments);
    result.meta = result.meta || {};

    if (payload.links) {
      result.meta.pagination = this.createPageMeta(payload.links);
    }

    return result;
  },
  createPageMeta(data) {

    let meta = {};

    Object.keys(data).forEach(type => {
      const link = data[type];
      meta[type] = {};
      let a = document.createElement('a');
      a.href = link;

      a.search.slice(1).split('&').forEach(pairs => {
        const [param, value] = pairs.split('=');

        if (param === 'page') {
          meta[type].number = parseInt(value);
        }

      });
      a = null;
    });

    return meta;

  }
});
