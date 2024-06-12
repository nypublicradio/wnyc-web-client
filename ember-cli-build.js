/* eslint-env node */
'use strict';
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
var fs = require('fs');

var env = EmberApp.env();

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    fingerprint: {
      enabled: env === 'production',
      prepend: process.env.FINGERPRINT_PREPEND_URL,
      exclude: ['assets/css/', 'assets/svg/100/']
    },
    sourcemaps: {
      enabled: true,
    },
    storeConfigInMeta: env !== 'development',
    'mirage-support': {
      includeAll: true
    },
    useWaypoints: true,
    'ember-cli-babel': {
      includePolyfill: true, // for ie 11 support
    },
    sassOptions: {
      includePaths: [
        'node_modules/include-media/dist',
      ]
    },
  });

  try {
    fs.accessSync('vendor/modernizr/modernizr-build.js');
    app.import('vendor/modernizr/modernizr-build.js');
  } catch(e) {
    console.log('there was a problem importing the modernizr build. please run grunt modernizr:dist first.');
  }

  app.import('vendor/polyfills/url.js');
  app.import('node_modules/normalize.css/normalize.css');

  // This is here so that legacy JS within our content pages can share
  // our version of jQuery without dying.
  app.import('node_modules/jquery-migrate/dist/jquery-migrate.min.js');

  return app.toTree();
};
