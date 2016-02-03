import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  slug(i) {
    return `show-slug-${i}`;
  },

  id() {
    return `shows/${this.slug}`;
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
    ]
  }
});
