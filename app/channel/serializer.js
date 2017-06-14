import DS from 'ember-data';
import { serializeApiResponseRelationships } from 'wqxr-web-client/api-response/serializer';
import { dasherizeKeys } from 'wqxr-web-client/story/serializer';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, typeClass, {included = [], data}, id, requestType) {
    let featuredStory = data.attributes.featured;
    delete data.attributes.featured;

    // id will have a trailing slash because it is derived from the URL and we
    // reliably append a trailing slash via Django
    included.push({
      type: 'api-response',
      id: `${id}about/1`,
      relationships: {
        'about-page': {
          data: {
            type: 'about-page', id: `${id}about`
          }
        }
      }
    },
    {
      type: 'about-page',
      id: `${id}about`,
      attributes: data.attributes.about
    });
    
    included = included.map(r => {
      let { attributes, type } = r;
      if (type === 'api-response') {
        r.relationships = serializeApiResponseRelationships(r.relationships, included);
        return r;
      }

      // story serializer expects keys dasherized
      if (type === 'story') {
        r.attributes = dasherizeKeys(r.attributes);
        r.id = attributes.slug;
      }
      return r;
    });

    if (featuredStory) {
      let story = {
        type: 'story',
        id: featuredStory.slug,
        attributes: dasherizeKeys(featuredStory)
      };
      
      included.push(story);

      data.relationships = {
        featured: {
          data: {
            type: 'story',
            id: featuredStory.slug
          }
        }
      };
    }
    return this._super(store, typeClass, {data, included}, id, requestType);
  }
});
