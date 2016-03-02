import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  slug(id) {
    return `story-${id}`;
  },
  itemTypeId: id => id,
  headers() {
    return {};
  },
  title(id) {
    return `Story ${id}`;
  },
  extendedStory: {
    body: 'Story body.'
  },
  commentsEnabled: true
});
