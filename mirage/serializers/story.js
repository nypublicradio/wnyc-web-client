import Serializer from './application';

export default Serializer.extend({
  serialize(response, request) {
    let story = Serializer.prototype.serialize.apply(this, arguments);
    if (request && request.url.match('related')) {
      return {
        results: story.data.map(({id, attributes}) => Object.assign({id}, attributes))
      };
    } else {
      return story;
    }
  }
});

