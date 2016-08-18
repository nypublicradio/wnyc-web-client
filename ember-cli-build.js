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
    sourcemaps: {
      enabled: true,
    },
    storeConfigInMeta: env !== 'development',

    // This project's in-repo addon configuration confuses Mirage and makes it
    // think we are distributing this project as an addon. Because of this it assumes
    // we're using Mirage to develop our addon tests using /tests/dummy/mirage as our
    // mirage folder. This config overrides the mirage folder to use the correct location
    // for developing an Ember application.
    'ember-cli-mirage': { directory: defaults.project.root + '/mirage' }
  });

  app.import('vendor/polyfills/url.js');
  app.import('bower_components/normalize.css/normalize.css');

  // This is here so that legacy JS within our content pages can share
  // our version of jQuery without dying.
  app.import('vendor/jquery-migrate/jquery-migrate.js');

  // All legacy JS modules that are directly called from this ember
  // app should be imported into the app's own build here. Notice that
  // these are symlinked to their original locations in the puppy
  // source.
  //app.import({
  //  development: 'vendor/soundmanager2/v297a-20150601/soundmanager2.js',
  //  production: 'vendor/soundmanager2/v297a-20150601/soundmanager2-nodebug.js'
  //});
  app.import({
    development: 'bower_components/SoundManager2/script/soundmanager2.js',
    production: 'bower_components/SoundManager2/script/soundmanager2-nodebug.js'
  });
  app.import('vendor/imagesloaded/imagesloaded.pkgd.js');
  app.import('vendor/underscore/underscore-1.4.4.js');
  app.import('vendor/backbone/backbone-1.0.0.js');


  //Okra-Bridge dependencies
  app.import('vendor/wnyc-legacy/jquery.cookie.js');
  app.import('vendor/wnyc-legacy/vendor/modernizr/modernizr-2.6.2-xd_player_custom.js');
  app.import('vendor/wnyc-legacy/vendor/backbone/plugins/localstorage/localstorage-1.1.0.js');
  app.import('vendor/wnyc-legacy/vendor/backbone/plugins/marionette/marionette-1.0.2.js');
  app.import('vendor/wnyc-legacy/lib/wnyc/namespace.js');

  if (env === 'test') {
    app.import('vendor/wnyc-bootstrap/index.js');
    app.import('vendor/wnyc-legacy/util.js');
    app.import('vendor/wnyc-legacy/lib/wnyc/listening.js');
    app.import('vendor/wnyc-legacy/overhaul/story/namespace_ext.js');
    app.import('vendor/wnyc-legacy/lib/wnyc/jquery.js');
    app.import('vendor/wnyc-legacy/lib/jquery/jquery.ba-postmessage.js');
    app.import('vendor/wnyc-legacy/lib/jquery/jquery.xdr.js');
    app.import('vendor/wnyc-legacy/lib/jquery/browserWarn.js');
    // svg for test env
    app.import('vendor/wnyc-media/svg/defs.svg', {
      destDir: 'media/svg'
    });
    app.import('vendor/wnyc-media/svg/nav_icons.svg', {
      destDir: 'media/svg'
    });
  }

  // Okra-Bridge
  app.import('vendor/wnyc-legacy/lib/wnyc/reversable_enum.js');
  
  if (env === 'development') {
    app.import('vendor/wnyc-legacy/lib/wnyc/url.js');
  }

  app.import('vendor/wnyc-legacy/lib/backbone/decoders/decoder.js');
  app.import('vendor/wnyc-legacy/lib/backbone/decoders/multi_file_decoder.js');
  app.import('vendor/wnyc-legacy/lib/backbone/decoders/rtmp_decoder.js');

  app.import('vendor/wnyc-legacy/lib/backbone/models/sound_manager_player.js');

  app.import('vendor/wnyc-legacy/lib/backbone/api_facades/stream_list_facade.js');
  app.import('vendor/wnyc-legacy/lib/backbone/api_facades/whats_on_facade.js');
  app.import('vendor/wnyc-legacy/lib/backbone/api_facades/most_listened_facade.js');
  app.import('vendor/wnyc-legacy/lib/backbone/api_facades/story_api_list_facade.js');
  app.import('vendor/wnyc-legacy/lib/backbone/api_facades/story_detail_facade.js');
  app.import('vendor/wnyc-legacy/lib/backbone/api_facades/xspf_json_facade.js');

  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/core.js');
  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/transform_stream_urls.js');
  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/web_player_controller.js');
  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/audio_metadata.js');

  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/okra/core.js');
  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/okra/commands.js');
  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/okra/requests.js');

  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/okra/ondemand/init.js');
  app.import('vendor/wnyc-legacy/lib/marionette/xd_player/okra/ondemand/controller.js');

  return app.toTree();
};
