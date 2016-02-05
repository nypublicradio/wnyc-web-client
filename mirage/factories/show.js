import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  id(i) {
    return `shows/show-slug-${i}/`;
  },

  linkroll() {
    return [
      {"href":null,"navSlug":"episodes","title":"Episodes"}
    ];
  },

  chunks() {
    return [
      {
        "content": "I'm a top chunk",
        "position": "top"
      }
    ];
  }
});
