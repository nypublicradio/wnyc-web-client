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
            url: faker.internet.url()
          }
        },
        template: faker.random.arrayElement(['story_default', 'story_video']),
        url: faker.internet.url()
      },
      type: faker.random.arrayElement(['event', 'story'])
    });
  }
  return res;
}

export default Factory.extend({
  slug: () => faker.lorem.words().join('-'),
  bucketItems
});
