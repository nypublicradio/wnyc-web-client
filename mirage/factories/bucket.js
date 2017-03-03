import { Factory, faker } from 'ember-cli-mirage';

function bucketItems() {
  var res = [];
  for (let i = 0; i < 20; i++) {
    res.push({
      attributes: {
        slug: faker.lorem.words().join('-'),
        title: faker.lorem.words().join(' '),
        imageMain: {
          url: faker.image.image()
        },
        headers: {
          brand: {
            title: faker.lorem.words().join(' '),
            url: 'http://marineboudeau.com'
          }
        },
        template: faker.random.arrayElement(['story_default', 'story_video']),
        url: 'http://marineboudeau.com'
      },
      type: faker.random.arrayElement(['event', 'story'])
    });
  }
  return res;
}

export default Factory.extend({
  bucketItems
});
