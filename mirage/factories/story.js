import { Factory, faker, trait } from 'ember-cli-mirage';

function makeSegment(_, index) {
  let title = faker.lorem.words(3).capitalize();
  return {
    'audio-available': true,
    'audio-duration-reaable': `${faker.random.number(50)} min`,
    'audio-eventually': true,
    'audio-may-stream': true,
    'episode-id': faker.random.number({min: 10000, max: 50000}),
    newsdate: faker.date.recent(),
    'segment-number': index,
    slug: title.dasherize(),
    title
  };
}

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
  audioMayEmbed: true,
  audioMayStream: true,
  analyticsCode: 'ExperimentalStory:trump-rubio-super-tuesday-morning-politics $A1$AD771$V0$Ms$D1$HS1$HC0$B0$SS+Everything You Need to Know About the 2016 Election+$C$SThe Brian Lehrer Show$T!news!politics!2016_election!super_tuesday!$AP/bl/bl022916apod.mp3$',
  analytics() {
    return {
      containers: "Show: The Brian Lehrer Show | Series: Everything You Need to Know About the 2016 Election",
      title: this.title
    };
  },
  cmsPK: id => id + 1,
  producingOrganizations: [],
  showProducingOrgs: [],
  allProducingOrgs: [],
  showTitle: faker.lorem.words(3),
  
  withSegments: trait({
    segments: Array.from(Array(3), makeSegment)
  })
});
