import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  start() {
    return faker.date.recent();
  },
  end: '2016-10-22T02:00:00',
  objType() {
    return faker.list.random('ShowSchedule', 'Airing');
  },
  scheduleEventTitle() {
    return Math.random() > 0.5 ? null : faker.lorem.sentence();
  },
  scheduleEventUrl() {
    return faker.internet.url();
  },
  parentTitle() {
    return faker.lorem.sentence();
  },
  parentUrl() {
    return faker.internet.url();
  },
});
