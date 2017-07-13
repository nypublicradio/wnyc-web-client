import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  modelNameFromPayloadKey: () => 'discover/stories',
  payloadKeyFromModelName: () => 'discover/stories'
});
