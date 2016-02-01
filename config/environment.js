/* jshint node: true, multistr: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'overhaul',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS,
    metricsAdapters: [],
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

    googleAPIv3Key: 'AIzaSyCDbxxvbl0Zj6af28IfWjJ-S0SKxwDXnkc',
    wnycURL: 'http://dev.wnyc.net:4568',
    wnycAPI: '',
    wnycAccountAPI: '',
    wnycEtagAPI: '',
    wnycStaticURL: '/static',
    featureFlags: {
      'django-page-routing': false,
      'persistent-player': false
    },
    contentSecurityPolicy: {
      'connect-src': "'self' *.wnyc.net:* ws://*.wnyc.net:*",
      'style-src': "'self' 'unsafe-inline' *.wnyc.net:* *.wnyc.org cloud.typography.com fonts.googleapis.com www.google.com platform.twitter.com",
      'img-src': "'self' data: *",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' data: *",
      'object-src': "'self' *.wnyc.net:* *.wnyc.org *.moatads.com *.googlesyndication.com",
      'font-src': "'self' data: fonts.gstatic.com",
      'frame-src': "'self' *"
    }
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
    ENV.wnycStaticURL = 'http://media.wnyc.org/static';
    ENV.wnycURL = 'http://www.wnyc.org';
  }

  return ENV;
};
