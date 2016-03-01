import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  id(id) {
    return `shows/${this.firstPage}-${id}/`;
  },
  about: {
    body: '<h1>About</h1>'
  },
  firstPage: 'list',
  linkroll() {
    if (this.firstPage === 'about') {
      return [
        {"href":null,"navSlug":"about","title":"About"},
        {"href":null,"navSlug":"episodes","title":"Episodes"}
      ];
    }
    return [
      {"href":null,"navSlug":"episodes","title":"Episodes"},
      {"href":null,"navSlug":"about","title":"About"}
    ];
  },

  chunks() {
    return [
      {
        "content": "I'm a top chunk",
        "position": "top"
      }
    ];
  },
  listingObjectType: 'show'
});
