import Ember from 'ember';
import config from './config/environment';
import AnalyticsMixin from './mixins/analytics';
import service from 'ember-service/inject';

const Router = Ember.Router.extend(AnalyticsMixin, {
  location: config.locationType,
  session: service(),
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

  this.route('shows');
  this.route('archived-shows');
  this.route('show', {path: 'shows/:slug'}, subpageRoutes);
  this.route('article', {path: 'articles/:slug'}, subpageRoutes);
  this.route('serie', {path: 'series/:slug'}, subpageRoutes);
  this.route('tag', {path: 'tags/:slug'}, subpageRoutes);
  this.route('blog', {path: 'blogs/:slug'}, subpageRoutes);
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

  // This is our catch all route that can render any existing page
  // from the django site. It will be used when there's nothing more
  // specific.
  this.route('djangorendered', { path: '*upstream_url' });
});

export default Router;
