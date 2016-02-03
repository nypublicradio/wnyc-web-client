import Ember from 'ember';
import service from 'ember-service/inject';

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
  listRouter: service(),
  channelTypeWell: computed('channelType', {
    get() {
      return `${get(this, 'channelType')}.well`;
    }
  }),

  tagName: 'nav',
  classNames: ['tabs-header', 'tabs-header--border'],

  didInsertElement() {
    const activeLink = this.$('.active');
    const list = this.$('.list').get(0);
    const el = this.element;

    run.scheduleOnce('afterRender', this, function() {
      if (!isEmpty(activeLink)) {
        set(this, 'activeLink', activeLink);
      } else {
        set(this, 'activeLink', this.$('a').first());
      }

      run.next(this, function() {
        this.handleResize(list, el);
        this.showActiveLink();
      });
    });

    this.$().on('transitionend', e => {
      if (e.originalEvent.propertyName === 'font-size') {
        this._updateLinePosition();
      }
    });

    // so we can explicitly remove this at destroy-time
    const boundHandler = set(this, 'boundResizeHandler', () => this.handleResize(list, el));
    $(window).on('resize', boundHandler);
  },

  willDestroyElement() {
    this.$().off('transitionend');
    $(window).off('resize', get(this, 'boundResizeHandler'));
  },

  activeLink: computed('listRouter.navSlug', {
    get() {
      const navSlug = get(this, 'listRouter.navSlug');
      const link = this.$(`[href*=${navSlug}]`);
      return link;
    },
    set(keyName, value) {
      return value;
    }
  }),

  updateRouteTitle: observer('activeLink', function() {
    const activeLink = get(this, 'activeLink');
    this.sendAction('action', activeLink);
  }),

  linePosition: computed('activeLink', {
    get() {
      const activeLink = get(this, 'activeLink');
      if (isEmpty(activeLink)) {
        return htmlSafe('');
      }
      const [left, w] = this._getDims(activeLink);
      const styleString = this._generateStyleString(left, w);
      return styleString;
    },
    set(keyName, value) {
      return value;
    }
  }),

  showActiveLink: observer('activeLink', function() {
    const activeLink = get(this, 'activeLink').get(0);
    if (isEmpty(activeLink)) {
      return;
    }
    if (!this._isFullyVisible(activeLink)) {
      this._scrollNav(activeLink);
    }
  }),

  handleResize(list, el) {
    if (this._isWiderThan(list, el)) {
      $(el).addClass('x-scrollable');
    } else {
      $(el).removeClass('x-scrollable');
    }

    this._updateLinePosition();
  },

  _isFullyVisible(link) {
    const linkBounds = link.getBoundingClientRect();
    const navBounds = link.offsetParent.getBoundingClientRect();
    return ((linkBounds.left > navBounds.left) && (linkBounds.right < navBounds.right));
  },

  _scrollNav(link) {
    const nav = link.offsetParent;
    nav.scrollLeft = link.offsetLeft;
  },

  _getDims(dom) {
    const $dom = $(dom);
    const navLeft = get(this, 'element.scrollLeft');
    return [$dom.position().left + navLeft, $dom.width()];
  },

  _generateStyleString(left, w) {
    const width         =             `width: ${w}px;`;
    const transform     =         `transform: translateX(${left}px);`;
    const mozTransform  =    `-moz-transform: translateX(${left}px);`;
    const wkTransform   = `-webkit-transform: translateX(${left}px);`;
    return htmlSafe(`${width} ${transform} ${mozTransform} ${wkTransform}`);
  },

  _updateLinePosition() {
    const activeLink = get(this, 'activeLink');
    const [left, w] = this._getDims(activeLink);
    const styleString = this._generateStyleString(left, w);
    set(this, 'linePosition', styleString);
  },

  _isWiderThan(dom1, dom2) {
    return dom1.getBoundingClientRect().width > dom2.getBoundingClientRect().width;
  }
});
