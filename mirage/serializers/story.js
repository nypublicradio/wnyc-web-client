import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(response, request) {
    let story = JSONAPISerializer.prototype.serialize.apply(this, arguments);
    if (request && request.url.match('related')) {
      return {
        results: story.data.map(({id, attributes}) => Object.assign({id}, attributes))
      };
    } else {
      return story;
    }
  }
});
