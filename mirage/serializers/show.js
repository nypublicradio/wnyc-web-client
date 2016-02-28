import ApplicationSerializer from './application';
import serialize from 'overhaul/mirage/utils/serialize';

export default ApplicationSerializer.extend({
  typeKeyForModel(model) {
    // This is a Mirage serialization bug, the wrong serializer
    // is being used for 'story'.
    if (model.modelName === 'show') {
      return 'channel';
    } else {
      return ApplicationSerializer.prototype.typeKeyForModel(model);
    }
  },
  serialize({id, attrs}, response) {
    const REGEX = /shows\/([^\/]+)-\d+/;
    let type = id.match(REGEX)[1];
    let apiResponseId = `${id}${attrs.linkroll[0].navSlug}/1`;

    switch(type) {
      case 'list':
        let storyList = server.createList('story', 11);
        let apiResponse = server.create('api-response', {
          id: apiResponseId,
          totalCount: 11,
          teaseList: server.schema.story.find(storyList.mapBy('id'))
        });
        break;
      case 'story':
        let story = server.create('story');
        break;
      case 'about':
        break;
    }

    let apiResponseModel = server.schema.apiResponse.find(apiResponse.id);
    let {data, included} = serialize(apiResponseModel);
    return {
      data: {
        type: 'channel',
        id,
        attributes: attrs
      },
      included: included.concat(data)
    }
  }
});
