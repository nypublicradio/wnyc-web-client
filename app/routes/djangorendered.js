import Ember from 'ember';
import ENV from 'overhaul/config/environment';
import get from 'ember-metal/get';
import { retryFromServer } from 'overhaul/lib/compat-hooks';
import service from 'ember-service/inject';

export default Ember.Route.extend({
  queryParams: {
    q: {
      refreshModel: true
    }
  },

  model({ upstream_url }, { queryParams }) {
    // This adds trailing slashes, because the server's redirect
    // doesn't otherwise work correctly due to the proxying I'm using
    // in development (which is neeeded due to CORs).
    upstream_url = upstream_url.replace(/\/*$/, '/');

    let qp = Object.keys(queryParams)
      .filter(q => ENV.QP_WHITELIST.contains(q)).map(p => `${p}=${queryParams[p].replace(/\s/g, '%20')}`);
    if (qp.length) {
      upstream_url += `?${qp.join('&')}`;
    }
    return this.store.find('django-page', upstream_url)
      .catch(e => retryFromServer(e, upstream_url));
  },
  afterModel() {
    const metrics = get(this, 'metrics');
    // must run before trackPageview
    metrics.invoke('nprDimensions', 'GoogleAnalytics', {});
    //
  }
});
