import DS from 'ember-data';
import Ember from 'ember';

const {
  computed,
  get
} = Ember;

export default DS.Model.extend({
  slug: DS.attr('string'),
  cmsPK: DS.attr('number'),
  title: DS.attr('string'),
  about: DS.belongsTo('api-response', {async: false}),

  sidebarChunks: DS.attr(), // Array of custom html markup
  chunkSidebarTop: computed('sidebarChunks', {
    get() {
      const chunks = get(this, 'sidebarChunks');
      if (!chunks) {
        return '';
      }
      const chunk = chunks.compact().findBy('position', 'top');
      if (chunk) {
        return chunk.content;
      } else {
        return '';
      }
    }
  }),
  chunkSidebarBottom: computed('sidebarChunks', {
    get() {
      const chunks = get(this, 'sidebarChunks');
      if (!chunks) {
        return '';
      }
      const chunk = chunks.compact().findBy('position', 'bottom');
      if (chunk) {
        return chunk.content;
      } else {
        return '';
      }
    }
  }),
  donateChunk: DS.attr(),
  donateURL: DS.attr(),

  linkroll: DS.attr(),
  bgColor: DS.attr('string'),
  description: DS.attr('string'),
  tease: DS.attr('string'),
  marqueeImage: DS.attr(),
  podcastLinks: DS.attr(),
  rssFeed: DS.attr('string'),
  logoImage: DS.attr(),
  listingObjectType: DS.attr('string'),
  itemType: computed.readOnly('listingObjectType'),
  editLink: DS.attr('string'),
  socialLinks: DS.attr(),
  facebook: computed.filterBy('socialLinks', 'title', 'facebook'),
  twitter: computed.filterBy('socialLinks', 'title', 'twitter'),
  newsletter: computed.filterBy('socialLinks', 'title', 'newsletter'),
  featured: DS.belongsTo('story', { inverse: null }),
  scheduleSummary: DS.attr('string'),
  producingOrganizations: DS.attr(),
  // computeds
  hasLinkroll: computed.bool('linkroll.firstObject'),
  hasMarquee: computed.bool('marqueeImage'),
  hasSubscriptionLinks: computed.bool('podcastLinks.firstObject'),
  hasHeaderButtons: computed.or('donateChunk', 'hasSubscriptionLinks')
});
