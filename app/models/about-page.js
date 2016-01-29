import DS from 'ember-data';

export default DS.Model.extend({
  body: DS.attr('string'),
  people: DS.attr(),
  social: DS.attr()
});
