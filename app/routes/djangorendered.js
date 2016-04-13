import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    scheduleStation: {
      refreshModel: true
    }
  },
  model({ upstream_url }, { queryParams }) {
    // This adds trailing slashes, because the server's redirect
    // doesn't otherwise work correctly due to the proxying I'm using
    // in development (which is neeeded due to CORs).
    upstream_url = upstream_url.replace(/\/*$/, '/');

    let qp = Object.keys(queryParams).map(p => `${p}=${encodeURIComponent(queryParams[p])}`);
    if (qp.length) {
      upstream_url += `?${qp.join('&')}`;
    }
    return this.store.find('django-page', upstream_url);
  }
});
