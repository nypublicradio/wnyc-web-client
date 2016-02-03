import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  show: belongsTo(),
  apiResponse: belongsTo()
});
