// This module works with module_wrapper.py to give us runtime control
// over each legacy Javascript file.

// -------
// This lets you declare that certain modules should run after
// others. It's needed because some of the old code is actually
// delivered in the wrong order, and only works when it's all
// evaluated before domready.
// -------
export const dependencies = Object.freeze({
  'js/lib/wnyc/user.js': [
    'js/lib/jquery/jquery.xdr.js',
    'js/lib/wnyc/jquery.js',
    'js/lib/wnyc/listening.js',
    'js/util.js',
  ],
  'js/lib/jquery/jquery.xdr.js': ['js/lib/jquery/jquery.ba-postmessage.js'],
  'js/lib/wnyc/search.js': ['js/jquery-ui-1.8.23.min.js'],
  'js/lib/jquery/autoload.js': ['js/lib/wnyc/search.js']
});

// Some dependencies are only required for certain pages. We know that dependencies
// are a djangorendered thing, so the keys in these object are files depended upon
// by other files, and the values are the djangorendered model ids with which
// the files will actually be served by django. See _unsatisfiedDeps
export const depFilter = Object.freeze({
  'js/lib/wnyc/search.js': 'search/'
});

// -------
// This lets us declare which modules are safe to only run once. By
// default we assume it is not safe and stateful work needs to be
// done, so modules not listed here will be rerun whenever django
// serves them up for a page.
//
// There are probably plenty of other modules that are safe to include
// here, with a little bit a review. Anything that only declares
// functions underneath window or jQuery is safe. Modules that add
// functions under `wnyc` are not currently safe, because that whole
// object gets recreated every request.
//
// A good refactoring strategy is to move code around so that more and
// more files can be listed here. In a well-built Javascript app,
// there's really only one entrypoint that kicks off all the stateful
// behavior.
// --------
export const runOnce = Object.freeze({
  'js/json2.js': true,
  'js/consoleFix.js': true,
  'js/swfobject.js': true,
  'js/vendor/underscore/underscore-1.4.4.js': true,
  'js/vendor/backbone/plugins/localstorage/localstorage-1.1.0.js': true,
  'js/vendor/backbone/backbone-0.9.9.js': true,
  'js/vendor/backbone/backbone-1.0.0.js': true,
  'js/vendor/handlebars/handlebars-2.0.0.min.js': true,
  'js/vendor/jwplayer/jwplayer.js': true,
  'js/vendor/modernizr/modernizr-2.6.2-xd_player_custom.js': true,
  'www.google.com/jsapi': true,
  'maps.googleapis.com/maps/api/js': true,
  'www.google-analytics.com/analytics.js': true,
  'pixel.quantserve.com/aquant.js': true,
  'www.googletagservices.com/tag/js/gpt.js': true,
});

import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Service.extend({
  router: Ember.inject.service('wnyc-routing'),
  init() {
    this._super();
    this.modules = window.WNYC_MODULES || Object.create(null);
    this.waiting = Object.create(null);
  },

  define(name, fn) {
    let unsatisfied = this._unsatisfiedDeps(name);
    if (unsatisfied.length > 0) {
      let tracker = { name, pending: unsatisfied.length, fn };
      unsatisfied.forEach(d => {
        this.waiting[d] = tracker;
      });
    } else {
      this._evaluate(name, fn);
    }
  },

  _unsatisfiedDeps(name) {
    let deps = dependencies[name];
    if (deps) {
      let routeParam = this.get('router').recognize(location.pathname).params[0];
      return deps.reject(d => this.modules[d])
        .reject(d => depFilter[d] && depFilter[d] !== routeParam);
    }
    return [];
  },

  _evaluate(name, fn) {
    if (this.modules[name] && runOnce[name]) {
      if (ENV.LOG_LEGACY_LOADER) {
        console.log("Not rerunning " + name);
      }
      return;
    }
    if (ENV.LOG_LEGACY_LOADER) {
      console.log("Running " + name);
    }
    this.modules[name] = fn;
    fn();
    if (this.waiting[name]) {
      setTimeout(() => {
        let tracker = this.waiting[name];
        this.waiting[name] = null;
        tracker.pending -= 1;
        if (tracker.pending < 1) {
          this._evaluate(tracker.name, tracker.fn);
        }
      });
    }
  }
});
