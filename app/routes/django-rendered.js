import Ember from 'ember';

export default Ember.Route.extend({
  model({ upstream_url }/*, transition*/) {
    // This adds trailing slashes, because the server's redirect
    // doesn't otherwise work correctly due to the proxying I'm using
    // in development (which is neeeded due to CORs).
    upstream_url = upstream_url.replace(/\/*$/, '/');

    // let queryParams = Object.keys(transition.queryParams).map(p => `${p}=${transition.queryParams[p]}`);
    // if (queryParams.length) {
    //   upstream_url += `?${queryParams.join('&')}`;
    // }
    return this.store.find('django-page', upstream_url);
  }
});
