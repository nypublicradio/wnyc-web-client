/* jshint asi: true*/
import Ember from 'ember';
import service from 'ember-service/inject';


const {
  Mixin,
  get,
  setProperties,
  isEmpty,
  $,
  Inflector
} = Ember;
const inflect = new Inflector(Inflector.defaultRules);

export default Mixin.create({
  pageNumbers:  service(),
  metrics:      service(),
  dataPipeline: service(),

  titleToken() {
    const channelType = get(this, 'channelType');
    const { channel } = this.modelFor(channelType);
    return get(channel, 'title');
  },

  beforeModel() {
    let channelType = this.routeName.split('.')[0]
    let channelPathName = inflect.pluralize(channelType.split('-')[0]);
    setProperties(this, {channelType, channelPathName});
  },

  afterModel(model) {
    let channelType = get(this, 'channelType')
    let { channel } = this.modelFor(channelType)
    let channelTitle = get(channel, 'title');
    let metrics = get(this, 'metrics');
    let dataPipeline = get(this, 'dataPipeline');
    let nprVals = get(channel, 'nprAnalyticsDimensions');

    // google analytics
    metrics.trackEvent('GoogleAnalytics', {
      category: `Viewed ${get(channel, 'listingObjectType').capitalize()}`,
      action: channelTitle,
    });

    // NPR
    metrics.trackPage('NprAnalytics', {
      page: `/${get(this, 'listingSlug')}`,
      title: channelTitle,
      nprVals,
    });

    // data pipeline
    dataPipeline.reportItemView({
      cms_id: channel.get('cmsPK'),
      item_type: channel.get('listingObjectType'),
    });

    $('main > section:last-of-type').css('opacity', 1)
    const teaseList = get(model, 'teaseList')
    if (isEmpty(teaseList)) {
      return
    }

    this._filterForFeatured(teaseList, channel)

  },
  setupController(controller) {
    this._super(...arguments);
    let channelType = get(this, 'channelType')
    let { channel } = this.modelFor(channelType)
    controller.setProperties({
      channelTitle: get(channel, 'title'),
      channelType,
      flipTease: get(channel, 'altLayout')
    });
  },

  actions: {
    loading() {
      $('main > section:last-of-type').css('opacity', 0.5)
    },
    pageNumberClicked(page) {
      const channelType = get(this, 'channelType');
      const navSlug = this._getNavSlug(channelType);
      this._scrollToOffset(channelType);
      this.transitionTo(`${channelType}.page`, navSlug ? `${navSlug}/${page}` : page);
    }
  },

  _getNavSlug(channelType) {
    const { channel } = this.modelFor(channelType);
    const { page_params } = this.paramsFor(`${channelType}.page`);
    let [ navSlug ] = page_params ? page_params.split('/') : [];
    const linkRollSlug = get(channel, 'linkroll.firstObject.navSlug');
    const hasLinkRoll = get(channel, 'hasLinkroll');

    if (hasLinkRoll && navSlug && !/^\d+$/.test(navSlug)) {
      return navSlug
    } else if (hasLinkRoll && linkRollSlug) {
      return linkRollSlug
    } else {
      return false
    }
  },

  _filterForFeatured(teaseList, channel) {
    const channelHasFeatured = get(channel, 'featured')
    const featuredId = get(channel, 'featured.id')
    const featuredStory = teaseList.findBy('id', featuredId)

    if (channelHasFeatured) {
      teaseList.removeObject(featuredStory)
    }
  },

  _scrollToOffset(channelType) {
    const { channel } = this.modelFor(channelType)
    const hasLinkroll = get(channel, 'hasLinkroll')
    const scrollTarget = hasLinkroll ? $('nav.tabs-header').get(0) : $('#channelTitle').get(0)
    if (scrollTarget.scrollIntoView) {
      scrollTarget.scrollIntoView()
    } else {
      window.scrollTo(0,0)
    }
  }
})
