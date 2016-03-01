export function pregnantApiResponse(id) {
  let attrs;
  if (/list/.test(id)) {
    let storyList = server.createList('story', 50);
    attrs = {
      id,
      totalCount: 1000,
      teaseList: server.schema.story.find(storyList.mapBy('id'))
    };
  } else if (/story/.test(id)) {
    let story = server.create('story');
    attrs = {
      id,
      totalCount: 1,
      story: server.schema.story.find(story.id)
    };
  }
  return server.schema.apiResponse.create(attrs);
}
