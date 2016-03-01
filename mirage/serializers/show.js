import ApplicationSerializer from './application';
import serialize from 'overhaul/mirage/utils/serialize';
import { pregnantApiResponse } from 'overhaul/tests/helpers/api-response';

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

    let data = {
      type: 'channel',
      id,
      attributes: attrs
    };
    if (/about/.test(id)) {
      return { data };
    }

    let apiResponseModel = pregnantApiResponse(`${id}${attrs.linkroll[0].navSlug}/1`);
    let {data:apiResponseJSON, included} = serialize(apiResponseModel);
    return {
      data,
      included: included.concat(apiResponseJSON)
    }
  }
});
