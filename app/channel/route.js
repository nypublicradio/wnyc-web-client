import Route from 'ember-route';
import service from 'ember-service/inject';
import Ember from 'ember';
const {
  get,
  set
} = Ember

export default Route.extend({
  listRouter: service(),

  model(params) {
    const channelType = this.routeName
    const listingSlug = `${channelType}/${params.slug}`

    return this.store.findRecord('channel', listingSlug)
  },
  afterModel(model) {
    const listRouter = get(this, 'listRouter')
    const channelTitle = get(model, 'title')
    set(listRouter, 'channelTitle', channelTitle)
  },
  setupController(controller) {
    this._super(...arguments)
    controller.set('channelType', this.routeName)
  },

  actions: {
    updateRouteTitle(activeLink) {
      const listRouter = get(this, 'listRouter')
      const navTitle = activeLink.text()

      set(listRouter, 'navTitle', navTitle)
    }
  }
})
