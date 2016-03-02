import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  pk: id => id,
  user_name: faker.name.findName,
  comment: faker.lorem.sentence,
  submit_date: faker.date.recent,
  location: faker.address.city
});
