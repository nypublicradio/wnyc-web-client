import DS from 'ember-data';
// import {
//     filterForByTitle
// } from 'overhaul-listings/utils/filters'

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, typeClass, payload, id) {
    payload.included.push({
      type: 'api-response',
      id: `${id}/about/1`,
      relationships: {
        aboutPage: {
          data: {
            type: 'about-page', id: `${id}/about`
          }
        }
      }
    },
    {
      type: 'about-page',
      id: `${id}/about`,
      attributes: payload.data.attributes.about
    });

    return payload;
  }
});

