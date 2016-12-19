import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  preferred_username: faker.internet.domainWord,
  adminURL: "/admin",
  email: faker.internet.email,
  given_name: faker.name.firstName,
  family_name: faker.name.lastName
});
