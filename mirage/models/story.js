import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  comments: hasMany(),
  related: hasMany('story')
});
