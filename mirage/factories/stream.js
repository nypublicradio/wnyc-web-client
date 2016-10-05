import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  name: faker.random.string,
  slug: faker.random.string,
  audioBumper: faker.internet.url
});
