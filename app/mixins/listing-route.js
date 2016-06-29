/* jshint asi: true*/
import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Mixin,
  get,
  set,
  computed,
  isEmpty,
  $,
  Inflector
} = Ember;
const inflector = new Inflector(Inflector.defaultRules);

export default Mixin.create({
  pageNumbers: service(),

  channelTitle: computed({
    get() {
      const { channel } = this.modelFor(get(this, 'channelType'))
      const channelTitle = get(channel, 'title')
      return channelTitle
    }
  }).readOnly(),

  beforeModel() {
    let channelType = this.routeName.split('.')[0]
    set(this, 'channelType', channelType)
  },

  afterModel(model) {

    $('main > section:last-of-type').css('opacity', 1)
    const teaseList = get(model, 'teaseList')
    if (isEmpty(teaseList)) {
      return
    }
    const channelType = get(this, 'channelType')
    const { channel } = this.modelFor(channelType)

    this._filterForFeatured(teaseList, channel)
  },
  setupController(controller) {
    this._super(...arguments);
    let channelType = get(this, 'channelType')
    let { channel } = this.modelFor(channelType)
    controller.set('channelTitle', get(channel, 'title'));
  },

  actions: {
    loading() {
      $('main > section:last-of-type').css('opacity', 0.5)
    },
    pageNumberClicked(number) {
      const channelType = get(this, 'channelType')
      const navSlug = this._getNavSlug(channelType)
      this._scrollToOffset(channelType)
      if (navSlug) {
        this.transitionTo(`${channelType}.well.page`, navSlug, number)
      } else {
        this.transitionTo(`${channelType}.well`, number)
      }
    }
  },

  buildId(channelType, page) {
    const { slug } = this.paramsFor(channelType)
    const navSlug = this._getNavSlug(channelType)
    const path = `${inflector.pluralize(channelType)}/${slug}/${navSlug ? `${navSlug}` : 'recent_stories'}`

    return `${path}/${page}`
  },

  _getNavSlug(channelType) {
    const { channel } = this.modelFor(channelType)
    const {navSlug} = this.paramsFor(`${channelType}.well`)
    const linkRollSlug = get(channel, 'linkroll.firstObject.navSlug')
    const hasLinkRoll = get(channel, 'hasLinkroll')

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
