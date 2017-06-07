import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  keyForAttribute: key => key,
  keyForRelationship: key => key.dasherize(),
  include: ['apiResponse'],
  typeKeyForModel(model) {
    // This is a Mirage serialization bug, the wrong serializer
    // is being used for 'story'.
    if (model.modelName === 'listing-page') {
      return 'channel';
    } else {
      return ApplicationSerializer.prototype.typeKeyForModel(model);
    }
  },
});
