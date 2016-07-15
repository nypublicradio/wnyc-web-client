import { Serializer } from 'ember-cli-mirage';
import moment from 'moment';

export default Serializer.extend({
  serialize() {
    let { comments } = Serializer.prototype.serialize.apply(this, arguments);
    return {
      count: comments.length,
      expires: moment().hour(8).format(), // expires 8 hours from now
      results: comments
    };
  }
});
