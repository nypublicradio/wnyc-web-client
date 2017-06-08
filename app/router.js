import Ember from 'ember';
import config from './config/environment';
import AnalyticsMixin from './mixins/analytics';
import service from 'ember-service/inject';

const Router = Ember.Router.extend(AnalyticsMixin, {
  session:      service(),
  
  location: config.locationType,
  
  willTransition(oldInfos, newInfos, transition) {
    this._super(...arguments);
    if (!['login', 'signup', 'validate', 'forgot', 'reset'].includes(transition.targetName)) {
      this.get('session').set('attemptedTransition', transition);
    }
  },
  rootURL: config.rootURL
});

function subpageRoutes() {
  this.route('page', {path: '*page_params'});
}

Router.map(function() {
  // This is an example of a route that we've customized beyond the
  // default behavior in the `djangorendered` route.
  this.route('story', { path: 'story/:slug' });

  this.route('show', {path: 'shows'});
  this.route('archived-shows');
  this.route('show-detail', {path: 'shows/:slug'}, subpageRoutes);
  this.route('article-detail', {path: 'articles/:slug'}, subpageRoutes);
  this.route('series-detail', {path: 'series/:slug'}, subpageRoutes);
  this.route('tag-detail', {path: 'tags/:slug'}, subpageRoutes);
  this.route('blog-detail', {path: 'blogs/:slug'}, subpageRoutes);

  this.route('stream', {path: 'streams'});
  this.route('playlist', {path: 'streams/:slug'});
  this.route('schedule', function() {
    this.route('date', {path: ':year/:month/:day'});
  });
  this.route('topics');
  this.route('settings');

  this.route('discover', function() {
    this.route('start');
    this.route('topics', {path: 'start/topics'});
    this.route('shows', {path: 'start/shows'});

    this.route('edit', function() {
      this.route('topics');
      this.route('shows');
    });

    this.route('index', { path: 'playlist'});
    this.route('redirect', { path: '/'} );
  });

  this.route('profile');

  this.route('login');
  this.route('signup');
  this.route('validate');
  this.route('forgot');
  this.route('reset');
  this.route('verify');

  // This is our catch all route that can render any existing page
  // from the django site. It will be used when there's nothing more
  // specific.
  this.route('djangorendered', { path: '*upstream_url' });
});

export default Router;
