import Ember from 'ember';
import { beforeTeardown } from '../lib/compat-hooks';
const { $ } = Ember;

export default Ember.Component.extend({
  router: Ember.inject.service('wnyc-routing'),

  didRender() {
    this.$().empty();
    this.get('page').appendTo(this.$());
  },

  click(event) {
    let target = $(event.target).closest('a');
    if (target.length > 0) {
      let href = target.attr('href');
      let route;

      let m = /\/\/www\.wnyc\.org\/(.*)$/.exec(href);
      if (m) {
        route = ['django-rendered', m[1]];
      } else if ((m = /^\/?([^/].*)$/.exec(href))) {
        route = ['django-rendered', m[1]];
      } else if (href === '/' || href === '#') {
        route = ['index'];
      }

      if (route) {
        this.get('router').transitionTo(...route);
        event.preventDefault();
        beforeTeardown(this.get('element'), this.get('page'));
        return false;
      }
    }
  }
});
