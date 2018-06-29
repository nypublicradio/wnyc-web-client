import Mixin from '@ember/object/mixin';
import { setProperties, get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';
import { inject as service } from '@ember/service';
import Inflector from 'ember-inflector';

const inflect = new Inflector(Inflector.defaultRules);

export default Mixin.create({
  pageNumbers:  service(),
  dataPipeline: service(),
  dataLayer:    service('nypr-metrics/data-layer'),

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
    let dataPipeline = get(this, 'dataPipeline');

    get(this, 'dataLayer').setForType(get(channel, 'itemType'), channel);

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
    },

    willTransition() {
      let channelType = get(this, 'channelType')
      let { channel } = this.modelFor(channelType)
      get(this, 'dataLayer').clearForType(get(channel, 'itemType'));

      return true;
    },

  },

  _getNavSlug(channelType) {
    const { channel } = this.modelFor(channelType);
    const { page_params } = this.paramsFor(`${channelType}.page`);
    let [ navSlug ] = page_params ? page_params.split('/') : [];
    const linkRollSlug = get(channel, 'linkroll.firstObject.nav-slug');
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
    const scrollTarget = hasLinkroll ? $('nav.nav-links').get(0) : $('.channel-title').get(0)
    if (scrollTarget.scrollIntoView) {
      scrollTarget.scrollIntoView()
    } else {
      window.scrollTo(0,0)
    }
  }
})
