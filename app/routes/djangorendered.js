import Ember from 'ember';
import moment from 'moment';
import ENV from 'overhaul/config/environment';
import { canonicalize } from 'overhaul/services/script-loader';
import { assign } from 'overhaul/lib/alien-dom';

export default Ember.Route.extend({
  queryParams: {
    scheduleStation: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    }
  },
  beforeModel() {
    let { upstream_url } = this.paramsFor('djangorendered');
    if (upstream_url === 'schedule') {
      this.replaceWith('djangorendered', `schedule/${moment().format('YYYY/MMM/DD').toLowerCase()}`);
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
      .catch((/*error*/) => {
        // retrieving this upstream_url failed, possibly because the server
        // redirected the request to a new destination which does not respect
        // our CORS request. reassign the url to the location and let's see
        // what happens
        assign(`${canonicalize(ENV.wnycURL)}/${upstream_url}`);
      });
  }
});
