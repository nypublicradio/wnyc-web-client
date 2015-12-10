import DS from 'ember-data';

function extractHeaders({ show }) {
  if (!Object.keys(show).length) {
    return {};
  }

  let path = show.show_url.match(/(?:http:\/\/.*wnyc.(?:net|org):\d+\/)(.*)\/$/);
  path = path[1] ? path[1] : path;
  return {
    brand: {
      path,
      title: show.show_title
    }
  };
}

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, [story, {bbModel, soundObject}], id) {

    story.headers = extractHeaders(story);

    return {
      data: {
        id,
        type: 'ondemand',
        attributes: {
          bbModel: bbModel,
          soundObject: soundObject
        },
        relationships: {
          story: {
            data: {
              type: 'story',
              id
            }
          }
        }
      },
      included: [{
        type: 'story',
        id,
        attributes: story
      }]
    };
  }
});
