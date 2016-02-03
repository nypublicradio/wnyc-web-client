import Ember from 'ember';
import service from 'ember-service/inject';
const {
  observer,
  get,
  set,
  Service
} = Ember;

export default Service.extend({
  router: service('-routing'),
  channelTitle: null,
  navSlug: null,
  navTitle: null,
  updateDocumentTitle: observer('navTitle', 'channelTitle', function() {
    const navTitle = get(this, 'navTitle');
    const channelTitle = get(this, 'channelTitle');
    const pageTitle = navTitle ? `${navTitle} - ${channelTitle}` : channelTitle;

    set(document, 'title', pageTitle);
  })
});
