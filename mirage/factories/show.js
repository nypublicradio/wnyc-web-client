import { Factory, faker } from 'ember-cli-mirage';
import Ember from 'ember';

function generateProducingOrg() {
  return {
    url: faker.internet.url(),
    name: faker.company.companyName(),
    logo: {}
  };
}

function generateLogo() {
  return {
    creditsUrl: '',
    template: faker.image.image(135, 135),
    crop: 'c'
  };
}

export default Factory.extend({
  id(id) {
    return `shows/${this.firstPage}-${id}/`;
  },
  slug: () => Ember.String.dasherize(faker.name.findName()),
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
  logoImage: generateLogo,
  tease: faker.lorem.sentences,
  firstPage: 'list',

  sidebarChunks() {
    return [
      {
        "content": "I'm a top chunk",
        "position": "top"
      }
    ];
  },
  listingObjectType: 'show',
  socialLinks: [],
  isFeatured: false
});
