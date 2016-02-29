import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  teaseList: hasMany('story'),
  story: belongsTo('story')
});
