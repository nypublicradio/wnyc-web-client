import DS from 'ember-data';
import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default DS.Model.extend({
  title: DS.attr('string'),
  about: DS.belongsTo('api-response', {async: false}),

  chunks: DS.attr(), // Array of custom html markup 
  chunkSidebarTop: computed('chunks', {
    get() {
      const chunks = get(this, 'chunks').compact();
      const chunk = chunks.findBy('position', 'top');
      if (chunk) {
        return chunk.content;
      } else {
        return '';
      }
    }
  }),
  chunkSidebarBottom: computed('chunks', {
    get() {
      const chunks = get(this, 'chunks').compact();
      const chunk = chunks.findBy('position', 'bottom');
      if (chunk) {
        return chunk.content;
      } else {
        return '';
      }
    }
  }),

  linkroll: DS.attr(),
  bgColor: DS.attr('string'),
  description: DS.attr('string'),
  donate: DS.attr(),
  tease: DS.attr('string'),
  marqueeImage: DS.attr(),
  podcastLinks: DS.attr(),
  rssFeed: DS.attr('string'),
  logoImage: DS.attr(),
  listingObjectType: DS.attr('string'),
  editLink: DS.attr('string'),
  socialLinks: DS.attr(),
  facebook: computed('socialLinks', {
    get() {
      return get(this, 'socialLinks').findBy('title', 'facebook');
    }
  }),
  twitter: computed('socialLinks', {
    get() {
      return get(this, 'socialLinks').findBy('title', 'twitter');
    }
  }),
  newsletter: computed('socialLinks', {
    get() {
      return get(this, 'socialLinks').findBy('title', 'newsletter');
    }
  }),
  featured: DS.attr(),
  scheduleSummary: DS.attr('string'),
  producingOrganizations: DS.attr(),
  // computeds
  hasFeatured: computed.bool('featured'),
  featuredId: computed('hasFeatured', {
    get() {
      const hasFeatured = get(this, 'hasFeatured');
      const featured = get(this, 'featured');

      if (hasFeatured) {
        // ember coerces model IDs to strings, so we want to make sure this value
        // matches type for other operations
        return String(get(featured, 'id'));
      }
    }
  }),
  hasLinkroll: computed.bool('linkroll.firstObject'),
  hasMarquee: computed.bool('marqueeImage'),
  hasDonationLink: computed.bool('donate'),
  hasSubscriptionLinks: computed.bool('podcastLinks.firstObject'),
  hasHeaderButtons: computed.or('hasDonationLink', 'hasSubscriptionLinks')
});
