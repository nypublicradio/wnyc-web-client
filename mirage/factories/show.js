import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  id(id) {
    return `shows/${this.firstPage}-${id}/`;
  },
  firstPage: 'list',
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
