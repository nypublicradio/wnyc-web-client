import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  audio_type: 'livestream',
  image_logo: () => faker.image.imageUrl(75, 75),
  name: faker.name.firstName,
  audio_bumper: faker.internet.url,
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
  },
  schedule_url: faker.internet.url,
  short_description: faker.lorem.sentence,
  playlist_url: faker.internet.url,
  whats_on: 100,
  urls: () => {
    return {
      ipod: faker.internet.url(),
      mobile_aac: faker.internet.url(),
      aac: [faker.internet.url()],
      rtsp: faker.internet.url()
    };
  }
});
