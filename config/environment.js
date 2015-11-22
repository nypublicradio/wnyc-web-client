/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'wnyc-wrapper',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    wnycURL: 'http://dev.wnyc.net:4302',
    wnycMediaURL: 'http://dev.wnyc.net:4302/media',
    googleAPIv3Key: 'AIzaSyCDbxxvbl0Zj6af28IfWjJ-S0SKxwDXnkc',
    wnycAPI: '',
    wnycAccountAPI: '',
    wnycEtagAPI: ''
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.LOG_LEGACY_LOADER = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.wnycAPI = '//api.wnyc.org';
    ENV.wnycAccountAPI = 'https://account.wnyc.org';
    ENV.wnycEtagAPI = 'https://www.wnyc.org';
  }

  return ENV;
};
