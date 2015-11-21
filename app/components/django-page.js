import Ember from 'ember';
import { beforeTeardown } from '../lib/compat-hooks';
import rewriter from 'ember-cli-proxy/rewriter';
const { $ } = Ember;

export default Ember.Component.extend({
  router: Ember.inject.service('wnyc-routing'),

  didRender() {
    let page = this.get('page');
    if (page !== this._lastPage) {
      this._lastPage = page;
      this.$().empty();
      this.get('page').appendTo(this.$());
    }
  },

  click(event) {
    let target = $(event.target).closest('a');
    if (target.length > 0) {
      let router = this.get('router');
      let origin = location.protocol + '//' + location.host;
      let href = rewriter.rewriteURL(target.attr('href'));
      if (href.indexOf(origin + '/wnyc') === 0) {
        href = href.replace(origin + '/wnyc', '').replace(/^\//, '');
        let { routeName, params } = router.recognize(href);
        router.transitionTo(routeName, ...params);
        event.preventDefault();
        beforeTeardown(this.get('element'), this.get('page'));
        return false;
      }
    }
  }
});
