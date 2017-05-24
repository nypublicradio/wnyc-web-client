import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  extractId(modelClass, {attributes}) {
    return attributes.slug;
  }
});
