import Ember from 'ember';
import ENV from 'overhaul/config/environment';

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

    let qp = Object.keys(queryParams).map(p => `${p}=${queryParams[p].replace(/\s/g, '%20')}`);
    if (qp.length) {
      upstream_url += `?${qp.join('&')}`;
    }
    return this.store.find('django-page', upstream_url)
      .catch((/*error*/) => {
        // retrieving this upstream_url failed, possibly because the server
        // redirected the request to a new destination which does not respect
        // our CORS request. reassign the url to the location and let's see
        // what happens
        location.assign(`${ENV.wnycURL}/${upstream_url}`);
      });
  }
});
