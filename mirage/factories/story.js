import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  headers() {
    return {};
  },
  title(id) {
    return `Story ${id}`;
  },
  extendedStory: {
    body: 'Story body.'
  }
});
