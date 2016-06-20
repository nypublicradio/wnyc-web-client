import Model from 'ember-data/model';
import attr from  'ember-data/attr';

export default Model.extend({
  title:              attr('string'),
  showTitle:          attr('string'),
  showUrl:            attr('string'),
  summary:            attr('string'),
  date:               attr('date'),
  estimatedDuration:  attr('number'),
  url:                attr('string'),
  audio:              attr('string'),
  cmsPK:              attr('string')
});
