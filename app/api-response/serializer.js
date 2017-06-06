import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForRelationship: key => key,
  keyForAttribute: key => key
});
