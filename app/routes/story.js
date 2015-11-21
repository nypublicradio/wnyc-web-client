import Ember from 'ember';

export default Ember.Route.extend({
  model({ slug }) {
    // This adds trailing slashes, because the server's redirect
    // doesn't otherwise work correctly due to the proxying I'm using
    // in development (which is neeeded due to CORs).
    return this.store.find('django-page', `story/${slug}`.replace(/\/*$/, '/'));
  }
});
