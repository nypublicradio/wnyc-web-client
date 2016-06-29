import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  username: faker.internet.domainWord,
  adminURL: "/admin",
  email: faker.internet.email,
  name: faker.findName,
});
