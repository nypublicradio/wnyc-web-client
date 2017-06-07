import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  typeKeyForModel: ({ modelName }) => modelName.dasherize(),
  include: ['teaseList', 'story']
});
