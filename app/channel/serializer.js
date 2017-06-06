import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute: key => key,
  keyForRelationship: key => key,
  normalizeResponse(store, typeClass, payload, id, requestType) {
    let { logoImage, marqueeImage, featured, about } = payload.data.attributes;
    // let featuredStory = payload.data.attributes.featured;
    // delete payload.data.attributes.featured;
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
      attributes: about
    },
    {
      type: 'image',
      id: logoImage ? logoImage.id : null,
      attributes: logoImage
    },
    {
      type: 'image',
      id: marqueeImage ? marqueeImage.id : null,
      attributes: marqueeImage
    },
    {
      type: 'story',
      id: featured ? featured.id : null,
      attributes: featured
    });

    payload.included = payload.included.map(r => {
      let { attributes, type, id } = r;
      let attrs = {};
      if (attributes) {
        Object.keys(attributes).forEach(k => attrs[k.dasherize()] = attributes[k]);
      }
      return {
        id,
        type: type.dasherize(),
        attributes: attrs 
      };
    });

    return this._super(store, typeClass, payload, id, requestType);
  },
  extractRelationships(modelClass, hash) {
    let { logoImage, marqueeImage, featured } = hash.attributes;
    let relationshps = {
      logoImage: {data: {type: 'image', id: String(logoImage.id) }},
      marqueeImage: {data: {type: 'image', id: String(marqueeImage.id) }},
      featured: {data: {type: 'story', id: String(featured.id) }},
      about: {data: {type: 'api-response', id: `${hash.id}about/1`}}
    };
    return relationshps;
  }
});
