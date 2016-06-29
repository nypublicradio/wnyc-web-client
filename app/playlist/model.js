import Model from 'ember-data/model';
import DS from 'ember-data';

export default Model.extend({
  stream: DS.belongsTo('stream'),
  items: DS.attr()
});
