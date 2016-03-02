import Ember from 'ember';
import config from './config/environment';
import AnalyticsMixin from './mixins/analytics';

const Router = Ember.Router.extend(AnalyticsMixin, {
  location: config.locationType
});

function subpageRoutes() {
  this.route('page', {path: ':page'});

  this.route('well', {path: ':navSlug'}, function() {
    this.route('page', {path: ':page'});
  });
}

Router.map(function() {
  // This is an example of a route that we've customized beyond the
  // default behavior in the `django-rendered` route.
  this.route('story', { path: 'story/:slug' });

  this.route('shows', {path: 'shows/:slug'}, subpageRoutes);
  this.route('articles', {path: 'articles/:slug'}, subpageRoutes);
  this.route('series', {path: 'series/:slug'}, subpageRoutes);
  this.route('tags', {path: 'tags/:slug'}, subpageRoutes);
  this.route('blogs', {path: 'blogs/:slug'}, subpageRoutes);

  // This is our catch all route that can render any existing page
  // from the django site. It will be used when there's nothing more
  // specific.
  this.route('django-rendered', { path: '*upstream_url' });
});

export default Router;
