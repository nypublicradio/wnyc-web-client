import DS from 'ember-data';
import Ember from 'ember';
import { normalizeForSorting } from '../helpers/normalize-for-sorting';

const {
  computed,
  get
} = Ember;

export default DS.Model.extend({
  altLayout: DS.attr('boolean'),
  slug: DS.attr('string'),
  cmsPK: DS.attr('number'),
  title: DS.attr('string'),
  sortableTitle: computed('title', function() {
    return normalizeForSorting([ get(this, 'title') ]);
  }),
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
        let text = chunk.content.replace(/\\x3C\/script>/g, '</script>');
        return this.store.createRecord('django-page', { text });
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
        let text = chunk.content.replace(/\\x3C\/script>/g, '</script>');
        return this.store.createRecord('django-page', { text });
      } else {
        return '';
      }
    }
  }),
  donateChunk: DS.attr(),
  headerDonateChunk: DS.attr('string'),

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
  hasHeaderButtons: computed.or('donateChunk', 'hasSubscriptionLinks'),
  nprAnalyticsDimensions: DS.attr(),
});
