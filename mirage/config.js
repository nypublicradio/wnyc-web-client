import config from 'overhaul/config/environment';
import { pregnantApiResponse } from 'overhaul/tests/helpers/api-response';

export default function() {
  this.namespace = config.wnycURL;

  this.get('/api/v3/channel/shows/:showId/:navSlug/:pageNumber', function(schema, request) {
    let { showId, navSlug, pageNumber } = request.params;
    let id = `shows/${showId}/${navSlug}/${pageNumber}`;
    let apiResponse = schema.apiResponse.find(id);

    if (!apiResponse) {
      return pregnantApiResponse(id);
    }
    return apiResponse;
  });

  this.get('*upstream_url', function(schema, request) {
    return schema.djangoPage.find({id: request.params.upstream_url});
  });
};
