import Route from 'ember-route';
import service from 'ember-service/inject';
import Ember from 'ember';
const {
  get,
  set
} = Ember
const { hash: waitFor } = Ember.RSVP;
import { isInDom } from '../lib/alien-dom';

export default Route.extend({
  listRouter: service(),

  model(params) {
    const channelType = this.routeName
    const listingSlug = `${channelType}/${params.slug}`

    if (isInDom(listingSlug)) {
      // if an alien dom is present, we can render our template just fine
      return this.store.findRecord('channel', listingSlug).then(channel => ({ channel }) )
    } else {
      return this.store.find('django-page', listingSlug).then(page => {
        return waitFor({
          page,
          channel: page.get('wnycChannel'),
          pageOne: page.get('wnycChannelPageone') // just to push it into the store
        })
      })
    }
  },
  afterModel({ channel }) {
    const listRouter = get(this, 'listRouter')
    const channelTitle = get(channel, 'title')
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
