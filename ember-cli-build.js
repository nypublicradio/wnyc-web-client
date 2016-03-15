/* jshint node:true */
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var mv = require('broccoli-stew').mv;

var env = EmberApp.env();

module.exports = function(defaults) {
  var pubTrees = ['public'];
  if (env === 'development') {
    pubTrees.push(mv('docs', 'docs'));
  }
  var app = new EmberApp(defaults, {
    babel: { includePolyfill: true },
    trees: {
      public: mergeTrees(pubTrees)
    },
    fingerprint: {
      enabled: env === 'production',
      prepend: process.env.FINGERPRINT_PREPEND_URL
    },
    sourcemaps: {
      enabled: true,
    },
    dotEnv: {
      clientAllowedKeys: [
        'GOOGLE_ANALYTICS',
        'GOOGLE_API_V3_KEY',
        'WNYC_API',
        'WNYC_ACCOUNT_ROOT',
        'WNYC_ETAG_API',
        'WNYC_STATIC_URL',
        'WNYC_URL',
      ],
    },
    storeConfigInMeta: EmberApp.env() !== 'development',

    // This project's in-repo addon configuration confuses Mirage and makes it
    // think we are distributing this project as an addon. Because of this it assumes
    // we're using Mirage to develop our addon tests using /tests/dummy/mirage as our
    // mirage folder. This config overrides the mirage folder to use the correct location
    // for developing an Ember application.
    'ember-cli-mirage': { directory: defaults.project.root + '/mirage' }
  });

  app.import('vendor/polyfills/url.js');
  app.import('bower_components/moment/moment.js');

  // This is here so that legacy JS within our content pages can share
  // our version of jQuery without dying.
  app.import('vendor/jquery-migrate/jquery-migrate.js');

  // All legacy JS modules that are directly called from this ember
  // app should be imported into the app's own build here. Notice that
  // these are symlinked to their original locations in the puppy
  // source.
  app.import('vendor/imagesloaded/imagesloaded.pkgd.js');
  app.import('vendor/wnyc-bootstrap/index.js');
  app.import('vendor/wnyc-legacy/lib/wnyc/listening.js');
  app.import('vendor/wnyc-legacy/lib/wnyc/namespace.js');
  app.import('vendor/wnyc-legacy/overhaul/story/namespace_ext.js');
  app.import('vendor/wnyc-legacy/lib/wnyc/jquery.js');
  app.import('vendor/wnyc-legacy/lib/jquery/jquery.ba-postmessage.js');
  app.import('vendor/wnyc-legacy/lib/jquery/jquery.xdr.js');
  app.import('vendor/wnyc-legacy/lib/jquery/browserWarn.js');

  return app.toTree();
};
