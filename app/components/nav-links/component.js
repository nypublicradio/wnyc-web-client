import Ember from 'ember';
import config from 'wnyc-web-client/config/environment';
import { canonicalize } from 'wnyc-web-client/services/script-loader';

const {
  get,
  set,
  $,
  computed,
  Component,
  run
} = Ember;

export default Component.extend({
  tagName: 'nav',
  links: [],
  classNames: ['tabs-header', 'tabs-header--border'],
  classNameBindings: ['xScrollable'],
  parsedLinks: computed('links', function() {
    let origin;
    if (config.environment === 'development') {
      // in development, we're usually running a copy of the prod DB which will
      // point to prod
      // in prod builds on demo or production, these values will point to our 
      // configured wnycURL
      origin = `http://www.${config.siteSlug}.org`;
    } else {
      origin = canonicalize(config.wnycURL);
    }
    let links = get(this, 'links');
    let navRoot = get(this, 'navRoot');
    return links.map(i => {
      let { href, navSlug } = i;
      if (!href) {
        i.href = `/${navRoot}/${navSlug}`;
        return i;
      }
      if (href.indexOf(origin) === 0) {
        // make sure the parsed path has a leading slash
        i.href = href.replace(origin, '').replace(/^([^\/]+)/, '/$1');
        return i;
      }
      return i;
    });
  }),
  init() {
    this._super(...arguments);
    // fallback to null if defaultSlug is undefined because a linkrolLlink without
    // a navSlug key will match on `undefined` in `findBy` below
    let defaultSlug = get(this, 'defaultSlug') || null;
    let links = get(this, 'links');
    let defaultIndex = links.indexOf(links.findBy('navSlug', defaultSlug));
    set(this, 'activeTabIndex', defaultIndex === -1 ? 0 : defaultIndex);
  },

  actions: {
    transition(navSlug, index) {
      set(this, 'activeTabIndex', index);
      get(this, 'transition')(navSlug);
    }
  },

  didInsertElement() {
    run.scheduleOnce('afterRender', this, 'handleResize');

    // so we can explicitly remove this at destroy-time
    set(this, 'boundResizeHandler', run.bind(this, 'handleResize'));
    $(window).on('resize', get(this, 'boundResizeHandler'));
  },

  willDestroyElement() {
    $(window).off('resize', get(this, 'boundResizeHandler'));
  },

  handleResize() {
    let list = Array.from(this.$('.list-item'));
    let el = this.element;
    let listWidth = list.map(n => $(n).outerWidth(true)).reduce((a, b) => a + b, 0);

    if (listWidth > el.getBoundingClientRect().width) {
      set(this, 'xScrollable', true);
    } else {
      set(this, 'xScrollable', false);
    }
  },
});
