import { JSONAPISerializer } from 'ember-cli-mirage';
import Ember from 'ember';
const { dasherize } = Ember.String;

export default JSONAPISerializer.extend({
  typeKeyForModel({ modelName }) {
    return dasherize(modelName);
  },

  // Our API generally uses camelCased keys instead of dasherized-keys
  // so we need to override these attribute hooks.

  keyForAttribute(attribute) {
    return attribute;
  },

  keyForRelationship(relationship) {
    return relationship;
  }
});
