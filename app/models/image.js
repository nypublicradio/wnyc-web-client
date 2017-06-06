import DS from 'ember-data';

export default DS.Model.extend({
  caption: DS.attr('string'),
  creditsUrl: DS.attr('string'),
  creditsName: DS.attr('string'),
  crop: DS.attr('string'),
  h: DS.attr('number'),
  isDisplay: DS.attr('boolean'),
  name: DS.attr('string'),
  source: DS.attr('string'),
  template: DS.attr('string'),
  url: DS.attr('string'),
  w: DS.attr('number')
});
