/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var mv = require('broccoli-stew').mv;

module.exports = function(defaults) {
  var pubTrees = ['public'];
  if (EmberApp.env() === 'development') {
    pubTrees.push(mv('docs', 'docs'));
  }
  var app = new EmberApp(defaults, {
    babel: { includePolyfill: true },
    trees: {
      public: mergeTrees(pubTrees)
    },
    fingerprint: {
      enabled: false
    },
    dotEnv: {
      clientAllowedKeys: ['GOOGLE_ANALYTICS'],
      path: {
        development: './.env',
        production: './.env.production',
        test: './.env.test'
      }
    },
  });

  app.import('bower_components/moment/moment.js');

  // This is here so that legacy JS within our content pages can share
  // our version of jQuery without dying.
  app.import('vendor/jquery-migrate/jquery-migrate.js');

  // All legacy JS modules that are directly called from this ember
  // app should be imported into the app's own build here. Notice that
  // these are symlinked to their original locations in the puppy
  // source.
  app.import('vendor/imagesloaded/imagesloaded.pkgd.js');
  app.import('vendor/wnyc-legacy/util.js')
  app.import('vendor/wnyc-legacy/lib/wnyc/listening.js')
  app.import('vendor/wnyc-legacy/lib/wnyc/namespace.js')
  app.import('vendor/wnyc-legacy/overhaul/story/namespace_ext.js')
  app.import('vendor/wnyc-legacy/lib/wnyc/jquery.js')
  app.import('vendor/wnyc-legacy/lib/jquery/jquery.ba-postmessage.js')
  app.import('vendor/wnyc-legacy/lib/jquery/jquery.xdr.js')

  return app.toTree();
};
