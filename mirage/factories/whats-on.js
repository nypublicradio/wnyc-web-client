import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name: faker.name.firstName,
  current_playlist_item: function() {
    return {
      catalog_entry: {
        composer: {
          url: faker.internet.url(),
          pk: faker.random.number(),
          slug: faker.lorem.words(2).join('-'),
          name: faker.name.findName()
        },
        title: faker.lorem.words(3).join(' '),
        soloists: []
      },
    };
  },
  current_show: null,
  future: [],
  has_playlists: false,
  expires_ts: Date.now() + 10000000,
  slug: (i) => {
    switch (i) {
      case 0:
        return "wnyc-fm939";
      case 1:
        return "q2";
      case 2:
        return "jonathan-channel";
      case 3:
        return "njpr";
      case 4:
        return "wnyc-am820";
      case 5:
        return "wqxr";
      case 6:
        return "wqxr-special";
      default:
        return faker.lorem.words(2).join('-');
    }
  }
});
