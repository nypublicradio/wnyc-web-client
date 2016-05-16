import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  pk() {
    return faker.random.uuid();
  },
  title() {
    return faker.lorem.sentence();
  },
  tease() {
    return faker.lorem.sentence();
  },
  url() {
    return faker.internet.url();
  },
  audio() {
    return faker.internet.url();
  },
  type() {
    return faker.list.cycle('nprarticle', 'article');
  }
});
