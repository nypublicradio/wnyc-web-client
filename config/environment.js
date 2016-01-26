/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'overhaul',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS,
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
    wnycAPI: '',
    wnycAccountAPI: '',
    wnycEtagAPI: '',
    wnycStaticURL: '/static'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.LOG_LEGACY_LOADER = true;

    // This is a convenience for developers to inform the ember app where it can
    // find a django server. Django will write a simple node module to a file at
    // `puppy/overhaul/config/dev_url` which exports its url and port, which we 
    // consume here for the rest of the app.
    //
    // In production, the ember app will point to www.wnyc.org, so this isn't required
    try {
      var devUrl = require('./dev_url');
      ENV.wnycURL = devUrl;
    } catch(e) {
      var chalk = require('chalk');
      console.log(chalk.yellow(e.stack) + "\n");
      console.log(chalk.bold.red("Could not find a dev_url file."));
      console.log(chalk.bold.red("Using http://www.wnyc.org instead"));
      console.log(chalk.bold.red("Run `./manage.py runserver 0.0.0.0:<port number>` to generate a url for the ember app."));
      process.exit(1);
    }
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
