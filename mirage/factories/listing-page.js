import ShowFactory from './show';
import { faker } from 'ember-cli-mirage';

function generateLogo() {
  return {
    creditsUrl: '',
    template: faker.image.image(135, 135),
    crop: 'c'
  };
}

export default ShowFactory.extend({
  id(id) {
    return `shows/${this.firstPage}-${id}/`;
  },
  logoImage: generateLogo,
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
});
