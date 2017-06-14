import DS from 'ember-data';

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

    if (featuredStory) {
      let story = {
        type: 'story',
        id: featuredStory.id,
        attributes: featuredStory
      };
      
      included.push(story);

      data.relationships = {
        featured: {
          data: {
            type: 'story',
            id: featuredStory.id
          }
        }
      };
    }
    return this._super(store, typeClass, {data, included}, id, requestType);
  }
});
