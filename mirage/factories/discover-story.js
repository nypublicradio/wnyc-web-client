import { Factory, faker } from 'ember-cli-mirage';

/* This is representing the response we're getting from the API. This is different than the discover/story model format we're using in the discover feature. Data gets transformed a bit by the serializer */

export default Factory.extend({
  id() {
    return faker.random.number(1000000);
  },

  // this needs to be only numbers, or the audio service will think this it's a 'stream' instead of 'onDemand'.

  title() { return faker.lorem.sentence(); },
  tease() { return faker.lorem.sentence(); },
  url()   { return `/story/${this.pk}`; },
  audio() { return `assets/test-audio.mp3?${this.pk}`; },
  // The audio URL is tightly coupled, assumed to be unique, and somewhere
  // down deep in an okra bridge there's some logic that updates the current
  // audio. If this isn't unique, play status gets totally borked

  type(i) { return faker.list.random('nprarticle', 'article')(i); },

  dateLine() { return faker.date.recent(); },


  estimatedDuration(i) {
    return Math.floor(faker.random.number.range(60, 3000)(i)); },
  headers() { // this is where the show info is
    let show_slug = faker.lorem.words(1);
    return {
      brand: {
        url: `show/${show_slug}`,
        title: faker.lorem.sentence(),
        logoImage: {

        }
      }
    };
  }
});
