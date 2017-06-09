import ApplicationSerializer from './application';
import { dasherize } from 'ember-string';

export default ApplicationSerializer.extend({
  include: ['apiResponse'],
  keyForAttribute: key => key,
  keyForRelationship: key => dasherize(key),
  typeKeyForModel(model) {
    // This is a Mirage serialization bug, the wrong serializer
    // is being used for 'story'.
    if (model.modelName === 'show') {
      return 'channel';
    } else {
      return model.modelName.dasherize();
    }
  },
});
