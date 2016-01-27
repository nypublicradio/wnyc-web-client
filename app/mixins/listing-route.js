import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Mixin,
  get,
  set,
  computed,
  isEmpty,
  $
} = Ember;

export default Mixin.create({
  pageNumbers: service(),
  listRouter: service(),

  channelTitle: computed({
    get() {
      const channelModel = this.modelFor(get(this, 'channelType'))
      const channelTitle = get(channelModel, 'title')
      return channelTitle
    }
  }).readOnly(),

  beforeModel() {
    let channelType = this.routeName.split('.')[0]
    set(this, 'channelType', channelType)
    const navSlug = this._getNavSlug(channelType)
    const listRouter = get(this, 'listRouter')
    set(listRouter, 'navSlug', navSlug)
  },

  model(params) {
    const channelType = get(this, 'channelType')
    const page = get(params, 'page') || 1
    const id = this.buildId(channelType, page)

    set(this, 'pageNumbers.totalPages', 0)

    return this.store.findRecord('api-response', id)
      .then(m => {
        // wait until models are loaded to keep UI consistent
        set(this, 'pageNumbers.page', page)
        set(this, 'pageNumbers.totalPages', get(m, 'totalPages'))

        return m
      })
  },

  afterModel(model) {
    $('main > section:last-of-type').css('opacity', 1)
    const teaseList = get(model, 'teaseList')
    if (isEmpty(teaseList)) {
      return
    }
    const channelType = get(this, 'channelType')
    const channelModel = this.modelFor(channelType)
    const channelTitle = get(channelModel, 'title')

    this._filterForFeatured(teaseList, channelModel)

    teaseList.forEach(s => {
      const brandTitle = get(s, 'headers.brand.title')
      if (brandTitle === channelTitle) {
        // don't show header links if this story belongs to this show
        set(s, 'headers.links', null)
      }
    })

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
        this.transitionTo(`${channelType}.page`, number)
      }
    }
  },

  buildId(channelType, page) {
    const { slug } = this.paramsFor(channelType)
    const navSlug = this._getNavSlug(channelType)
    const path = `${channelType}/${slug}/${navSlug ? `${navSlug}` : 'all_stories'}`

    return `${path}/${page}`
  },

  _getNavSlug(channelType) {
    const channelModel = this.modelFor(channelType)
    const {navSlug} = this.paramsFor(`${channelType}.well`)
    const linkRollSlug = get(channelModel, 'linkroll.firstObject.navSlug')
    const hasLinkRoll = get(channelModel, 'hasLinkroll')

    if (hasLinkRoll && navSlug) {
      return navSlug
    } else if (hasLinkRoll && linkRollSlug) {
      return linkRollSlug
    } else {
      return false
    }
  },

  _filterForFeatured(teaseList, channelModel) {
    const channelHasFeatured = get(channelModel, 'hasFeatured')
    const featuredId = get(channelModel, 'featuredId')
    // ember coerces IDs to strings, but these are just straight objects, for now
    // coerce to a Number until the day they are proper ember models
    const featuredStory = teaseList.findBy('id', Number(featuredId))

    if (channelHasFeatured) {
      teaseList.removeObject(featuredStory)
    }
  },

  _scrollToOffset(channelType) {
    const channel = this.modelFor(channelType)
    const hasLinkroll = get(channel, 'hasLinkroll')
    const scrollTarget = hasLinkroll ? $('nav.tabs-header').get(0) : $('#channelTitle').get(0)
    if (scrollTarget.scrollIntoView) {
      scrollTarget.scrollIntoView()
    } else {
      window.scrollTo(0,0)
    }
  }
})
