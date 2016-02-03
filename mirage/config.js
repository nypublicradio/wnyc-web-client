import config from 'overhaul/config/environment';

export default function() {
  this.namespace = config.wnycURL;

  this.get('/api/v3/channel/shows/:showId/:navSlug/1', function(schema, request) {
    let { showId, navSlug } = request.params;
    return schema.apiResponse.find(`shows/${showId}/${navSlug}/1`);
  });
}
