import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  slug(id) {
    return `story-${id}`;
  },
  itemTypeId: id => id,
  headers() {
    return {};
  },
  title(id) {
    return `Story ${id}`;
  },
  extendedStory: {
    body: 'Story body.'
  },
  commentsEnabled: true,
  dateLineDatetime: faker.date.recent,
  analyticsCode: 'ExperimentalStory:trump-rubio-super-tuesday-morning-politics $A1$AD771$V0$Ms$D1$HS1$HC0$B0$SS+Everything You Need to Know About the 2016 Election+$C$SThe Brian Lehrer Show$T!news!politics!2016_election!super_tuesday!$AP/bl/bl022916apod.mp3$'
});
