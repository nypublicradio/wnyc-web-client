import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.attr('string'),
  location: DS.attr('string'),
  comment: DS.attr('string'),
  publishDate: DS.attr('string')
});
