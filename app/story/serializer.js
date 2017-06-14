import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  extractId: (modelClass, {attributes}) => attributes.slug,
});
