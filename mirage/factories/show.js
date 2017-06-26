import { Factory, faker } from 'ember-cli-mirage';
import { dasherize } from 'ember-string';

const slugify = str => dasherize(str.replace(/[^\w\s]/gi, '-'));

function generateProducingOrg() {
  return {
    url: faker.internet.url(),
    name: faker.company.companyName(),
    logo: {}
  };
}

export default Factory.extend({
  slug: () => slugify(faker.name.findName()),
  about: {
    body: '<h1>About</h1>'
  },
  title() {
    return `${faker.name.findName()} Show`;
  },
  producingOrganizations() {
    let org = [generateProducingOrg()];

    if (Math.random() > 0.5) {
      org.push(generateProducingOrg());
    }

    return org;
  },
  tease: faker.lorem.sentences,
  isFeatured: false,
});
