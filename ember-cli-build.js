/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var mv = require('broccoli-stew').mv;
var fs = require('fs');

var env = EmberApp.env();

module.exports = function(defaults) {
  var pubTrees = ['public'];
  if (env === 'development') {
    pubTrees.push(mv('docs', 'docs'));
  }
  var app = new EmberApp(defaults, {
    autoprefixer: {
      browsers: ['last 3 versions']
    },
    babel: { includePolyfill: true },
    trees: {
      public: mergeTrees(pubTrees)
    },
    fingerprint: {
      enabled: env === 'production',
      prepend: process.env.FINGERPRINT_PREPEND_URL
    },
    storeConfigInMeta: env !== 'development',

    // This project's in-repo addon configuration confuses Mirage and makes it
    // think we are distributing this project as an addon. Because of this it assumes
    // we're using Mirage to develop our addon tests using /tests/dummy/mirage as our
    // mirage folder. This config overrides the mirage folder to use the correct location
    // for developing an Ember application.
    'ember-cli-mirage': { directory: defaults.project.root + '/mirage' }
  });

  try {
    fs.accessSync('vendor/modernizr/modernizr-build.js');
    app.import('vendor/modernizr/modernizr-build.js');
  } catch(e) {
    console.log('there was a problem importing the modernizr build. please run grunt modernizr:dist first.');
  }
  
  app.import('vendor/polyfills/url.js');
  app.import('bower_components/normalize.css/normalize.css');

  // This is here so that legacy JS within our content pages can share
  // our version of jQuery without dying.
  app.import('bower_components/jquery-migrate/index.js');

  // All legacy JS modules that are directly called from this ember
  // app should be imported into the app's own build here. Notice that
  // these are symlinked to their original locations in the puppy
  // source.
  app.import('bower_components/imagesloaded/imagesloaded.pkgd.js');

  return app.toTree();
};
