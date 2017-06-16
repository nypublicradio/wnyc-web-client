import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name: faker.name.firstName,
  current_playlist_item: null,
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
        return faker.lorem.words(2).replace(/\W/g,'-');
    }
  }
});
