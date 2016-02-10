import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, payload) {
    return {
      data: payload.results.map(result => {
        let {
          pk:id,
          user_name:author,
          comment,
          submit_date:publishDate
        } = result;
        return {
          id,
          type: 'comment',
          attributes: {
            author,
            comment,
            publishDate,
            location: result.location
          }
        };
      })
    };
  }
});
