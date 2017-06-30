import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  slug(id) {
    return `story-${id}`;
  },
  itemTypeId: 24,
  itemType: 'story',
  headers() {
    return {
      brand: {
        url: faker.internet.url(),
        title: 'The Brian Lehrer Show',
      }
    };
  },
  title(id) {
    return `Story ${id}`;
  },
  body: 'Story body.',
  commentsEnabled: true,
  newsdate: faker.date.recent,
  publishAt: faker.date.recent,
  audio: () => faker.internet.url() + '.mp3',
  audioEventually: true,
  audioAvailable: true,
  analyticsCode: 'ExperimentalStory:trump-rubio-super-tuesday-morning-politics $A1$AD771$V0$Ms$D1$HS1$HC0$B0$SS+Everything You Need to Know About the 2016 Election+$C$SThe Brian Lehrer Show$T!news!politics!2016_election!super_tuesday!$AP/bl/bl022916apod.mp3$',
  analytics() {
    return {
      containers: "Show: The Brian Lehrer Show | Series: Everything You Need to Know About the 2016 Election",
      title: this.title
    };
  },
  cmsPK: id => id + 1,
  producingOrganizations: "",
});
