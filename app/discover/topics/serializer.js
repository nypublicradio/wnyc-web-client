import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  normalizeQueryResponse(store, primaryModelClass, payload) {
    /* Data comes back as
      { pk: 125125124,
       links: [
          {url: 'a-a', title: 'Arts'},
          etc
      ]}
    */
    var data = payload.links.map(topic => {
      return {
        id: `${payload.pk}_${topic.url}`,
        type: 'discover/topics',
        attributes: topic
      };
    });

    return {
      data: data
    };
  }
});
