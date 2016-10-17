import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(streams, {params}) {
    let json = Serializer.prototype.serialize.apply(this, arguments);
    if (params.slug) {
      return json.streams[0];
    } else {
      return {
        results: json.streams,
        count: json.streams.length
      };
    }
  }
});
