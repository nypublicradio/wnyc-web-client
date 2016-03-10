import DS from 'ember-data';
export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, typeClass, payload, id) {
    payload.included = payload.included || [];

    // id will have a trailing slash because it is derived from the URL and we
    // reliably append a trailing slash via Django
    payload.included.push({
      type: 'api-response',
      id: `${id}about/1`,
      relationships: {
        aboutPage: {
          data: {
            type: 'about-page', id: `${id}about`
          }
        }
      }
    },
    {
      type: 'about-page',
      id: `${id}about`,
      attributes: payload.data.attributes.about
    });

    return payload;
  }
});

