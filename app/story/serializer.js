import DS from 'ember-data';

export function dasherizeKeys(attributes) {
  let attrs = {};
  if (attributes) {
    Object.keys(attributes).forEach(k => attrs[k.dasherize()] = attributes[k]);
  }
  return attrs;
}

export default DS.JSONAPISerializer.extend({
  extractId: (modelClass, {attributes}) => attributes.slug,
});
