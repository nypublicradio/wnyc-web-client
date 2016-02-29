import config from 'overhaul/config/environment';

export default function() {
  this.namespace = config.wnycURL;

  this.get('/api/v3/channel/shows/:showId/:navSlug/:pageNumber', function(schema, request) {
    let { showId, navSlug, pageNumber } = request.params;
    let id = `shows/${showId}/${navSlug}/${pageNumber}`;
    let apiResponse = schema.apiResponse.find(id);

    if (!apiResponse) {
      let attrs;
      let storyList = server.createList('story', 50);
      if (/list/.test(showId)) {
        attrs = {
          id,
          totalCount: 1000,
          teaseList: server.schema.story.find(storyList.mapBy('id'))
        }
      }
      return schema.apiResponse.create(attrs);
    }
    return apiResponse;
  });
}
