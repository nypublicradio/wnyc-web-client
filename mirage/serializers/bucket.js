import { JSONAPISerializer } from 'ember-cli-mirage';

export default JSONAPISerializer.extend({
  serialize(response, request) {
    // if a request has a query string, mirage thinks it's a request for multiple
    // records, but buckets use a query string as a back-end filter
    if (Object.keys(request.queryParams).length > 0) {
      return JSONAPISerializer.prototype.serialize.call(this, response.models[0], request);
    }
    return JSONAPISerializer.prototype.serialize.apply(this, arguments);
  }
});
