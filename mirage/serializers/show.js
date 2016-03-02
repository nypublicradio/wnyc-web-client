import ApplicationSerializer from './application';

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
});
