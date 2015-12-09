import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  normalizeResponse(store, primaryModelClass, [story, {bbModel, soundObject}], id) {
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
