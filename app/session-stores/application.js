import CookieStore from 'ember-simple-auth/session-stores/cookie';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import config from '../config/environment';

export default CookieStore.extend({
  store: service(),

  init() {
    this._super(...arguments);
    this._setCookieDomain();
    this.on('sessionDataUpdated', (d) => {
      this._restoreQueue(d);
      this._restoreListens(d);
      this._restoreDiscoverQueue(d);
    });
  },

  restore() {
    let data = this._super(...arguments);
    return data
      .then(d => this._restoreQueue(d))
      .then(d => this._restoreDiscoverQueue(d))
      .then(d => this._restoreListens(d));
  },

  _setCookieDomain(){
    //only set the cookieDomain if it matches domain of the current url
    let currentUrl = window.location.href;
    let envDomain = config.cookieDomain;

    if (currentUrl.indexOf(envDomain) > 1){
      this.set("cookieDomain", envDomain);
    }
  },

  _restoreDiscoverQueue(data) {
    let store = this.get('store');
    let queue = data["discover-queue"];

    if (!queue) {
      return data;
    }

    // convert serialized records to format the store expects
    // from [{data: { .. }}, {data: { ... }}]
    // to   {data: [ { ... }, { ... } ]}
    let payload = {data: queue.mapBy('data')};
    store.pushPayload('discover/stories', payload);

    let stories = queue.mapBy('data.id').map(id => store.peekRecord('discover/stories', id));
    set(data, 'discover-queue', stories);
    return data;
  },

  _restoreQueue(data) {
    let store = this.get('store');
    let { queue } = data;
    if (!queue) {
      return data;
    }
    // convert serialized records to format the store expects
    // from [{data: { .. }}, {data: { ... }}]
    // to   {data: [ { ... }, { ... } ]}
    let payload = {data: queue.mapBy('data')};
    store.pushPayload(payload);

    let stories = queue.mapBy('data.id').map(id => store.peekRecord('story', id));
    set(data, 'queue', stories);
    return data;
  },

  _restoreListens(data) {
    let store = this.get('store');
    let { listens } = data;
    if (!listens) {
      return data;
    }
    // convert listens to stories
    // from [{ id, story: { data: { ... } } }, { id, story: { data: { ... } } }]
    // to: {data: [ { ... }, { ... } ]}
    let payload = {data: listens.mapBy('story.data')};
    store.pushPayload(payload);
    let stories = listens.mapBy('story.data.id').map(id => store.peekRecord('story', id));
    set(data, 'listens', listens.map((l, i) => ({id: l.id, story: stories[i]})));
    return data;
  }
});
