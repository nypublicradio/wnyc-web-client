import { Factory, faker } from 'ember-cli-mirage';

function headerItem() {
  return {
    title: faker.lorem.words().join(' '),
    url: faker.internet.url()
  };
}

let links = Array.apply(null, Array(10)).map(headerItem);

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
          brand: faker.random.arrayElement(links),
          links: [faker.random.arrayElement(links), faker.random.arrayElement(links)]
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
