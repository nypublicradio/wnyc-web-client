import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize() {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    if (json.streams.length === 1) {
      return json.streams[0];
    }
    return {
      results: json.streams,
      count: json.streams.length
    };
  }
});
