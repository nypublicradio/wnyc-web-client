import Ember from 'ember';
import JSONAPISerializer from 'ember-data/serializers/json-api';

export default JSONAPISerializer.extend({
  keyForAttribute: (key) => Ember.String.camelize(key),
});
