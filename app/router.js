import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  // This is an example of a route that we've customized beyond the
  // default behavior in the `django-rendered` route.
  this.route('story', { path: '/story/:slug' });

  // This is our catch all route that can render any existing page
  // from the django site. It will be used when there's nothing more
  // specific.
  this.route('django-rendered', { path: '*upstream_url' });
});

export default Router;
