import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';

const {
  get,
  set,
  $,
  computed,
  observer,
  isEmpty,
  Component,
  run
} = Ember;

const {htmlSafe} = Ember.String;

export default Component.extend({
  parsedLinks: computed('links', function() {
    let origin;
    if (config.environment === 'development') {
      // in development, we're usually running a copy of the prod DB which will
      // point to prod
      // in prod builds on demo or production, these values will point to our 
      // configured wnycURL
      origin = 'http://www.wnyc.org';
    } else {
      origin = config.wnycURL;
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
        i.href = href.replace(origin, '');
        return i;
      }
      return i;
    });
  }),

  tagName: 'nav',
  classNames: ['tabs-header', 'tabs-header--border'],
  init() {
    this._super();
    let defaultSlug = get(this, 'defaultSlug');
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
    const list = this.$('.list').get(0);
    const el = this.element;

    run.scheduleOnce('afterRender', this, function() {
      run.next(this, function() {
        this.handleResize(list, el);
      });
    });

    // so we can explicitly remove this at destroy-time
    const boundHandler = set(this, 'boundResizeHandler', () => this.handleResize(list, el));
    $(window).on('resize', boundHandler);
  },

  willDestroyElement() {
    $(window).off('resize', get(this, 'boundResizeHandler'));
  },

  handleResize(list, el) {
    if (this._isWiderThan(list, el)) {
      $(el).addClass('x-scrollable');
    } else {
      $(el).removeClass('x-scrollable');
    }
  },

  _isWiderThan(dom1, dom2) {
    return dom1.getBoundingClientRect().width > dom2.getBoundingClientRect().width;
  }
});
