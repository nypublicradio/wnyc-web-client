import Route from 'ember-route';
import ENV from 'overhaul/config/environment';
import moment from 'moment';
import { canonicalize } from 'overhaul/services/script-loader';
import { assign } from 'overhaul/lib/alien-dom';

export default Route.extend({
  templateName: 'djangorendered',

  model() {
    return this.store.find('django-page', 'topics/')
      .catch((err) => {
        if (err.response.status === 404 || err.response.status === 500) {
          throw err;
        }
        // retrieving this upstream_url failed, possibly because the server
        // redirected the request to a new destination which does not respect
        // our CORS request. reassign the url to the location and let's see
        // what happens
        assign(`${canonicalize(ENV.wnycURL)}/${upstream_url}`);
      });
  }
});