import { Factory, faker, trait } from 'ember-cli-mirage';

export default Factory.extend({
  preferred_username: faker.internet.domainWord,
  adminURL: "/admin",
  email: faker.internet.email,
  given_name: faker.name.firstName,
  family_name: faker.name.lastName,
  status: 'CONFIRMED',

  facebook: trait({
    picture: faker.internet.avatar,
    "custom:facebook_id": 1234,
    status: 'FORCE_CHANGE_PASSWORD'
  })
});
