import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  slug: () => faker.lorem.words(2).join('-'),
  content: faker.lorem.sentence
});
