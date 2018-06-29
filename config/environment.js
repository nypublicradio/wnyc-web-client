/* eslint-env node */
'use strict';

module.exports = function(environment) {

  function usingProxy() {
    return !!process.argv.filter(function (arg) {
      return arg.indexOf('--proxy') === 0;
    }).length;
  }

  const ALIEN_DOM_ROOT = environment === 'test' ? '#ember-testing' : 'body';

  let ENV = {
    modulePrefix: 'wnyc-web-client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    emberHifi: {
      connections: [{
        name: 'NativeAudio'
      }],
      alwaysUseSingleAudioElement: false
    },
    'ember-cli-mirage': {
      autostart: true // https://github.com/samselikoff/ember-cli-mirage/blob/master/CHANGELOG.md#how-it-works-in-different-types-of-tests
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created

      /* Isn't this where all our app config variables should go? - JK */
    },
    // required for what's on widget compat
    exportApplicationGlobal: true,
    QP_WHITELIST: ['q', 'scheduleStation', 'next', 'n'], // see puppy/settings/base_settings.py

    sentry: {
      dsn: process.env.SENTRY_DSN,
      //debug: process.env.DEPLOY_TARGET !== 'production',
      development: environment !== 'production',
      includePaths: [
        process.env.WNYC_URL,
        /https?:\/\/(static|demo-static)\.wnyc\.org/,
        /https?:\/\/media\.wnyc\.org/,
        /https?:\/\/(demo2-wnyc)\.wqxr\.org/
      ],
      whitelistUrls: [
        /https?:\/\/(static|demo-static)\.wnyc\.org\/assets\/(vendor|wnyc-web-client)-.*/,
        /https?:\/\/media\.wnyc\.org\/static\/.*\.js/,
        /https?:\/\/((demo2-wnyc)\.)?wqxr\.org\/static\/.*\.js/
      ],
      ravenOptions: {
        shouldSendCallback: function({extra}) {
          var TOO_LONG = 1000 * 60 * 60 * 24; // one day
          if (extra['session:duration'] > TOO_LONG) {
            return false;
          }

          // only send 5% of errors
          var sampleRate = 5;
          return (Math.random() * 100 <= sampleRate);
        },
        ignoreUrls: [
          // Facebook blocked
          /connect\.facebook\.net\/en_US\/all\.js/i,
          // Chrome extensions
          /extensions\//i,
          /^chrome:\/\//i,
          /chartbeat/i,
        ],
        ignoreErrors: [
          'adsafeprotected',
          'sascdn'
        ]
      }
    },
    flashMessageDefaults: {
      preventDuplicates: true,
      timeout: 10000
    },
    queueAudioBumperURL: 'http://audio.wnyc.org/streambumper/streambumper000008_audio_queue.mp3',
    siteSlug: 'wnyc',
    siteName: 'WNYC',
    siteId: 1,
    clientSlug: 'wnyc_web',
    // these are provided via a .env file or else by Django's EmberAdapter
    // fall back to demo GA key

    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS || 'UA-46158613-1',
    nprGoogleAnalyticsKey: 'UA-18188937-11',
    googleAPIv3Key: process.env.GOOGLE_API_V3_KEY,
    discoverStation: "wnyc-v2",
    discoverAPIKey: "trident",
    discoverTopicsKey: "wnyc",
    showsDiscoverStation: "active-shows",
    showsAPIKey: "hummingbird",
    moreShowsDiscoverStation: "archived-shows",
    moreShowsAPIKey: "mammoth",
    webRoot: process.env.WNYC_URL,
    adminRoot: process.env.ADMIN_ROOT,
    authAPI: process.env.AUTH_SERVICE,
    membershipAPI: process.env.MEMBERSHIP_SERVICE,
    etagAPI: process.env.ETAG_API,
    publisherAPI: process.env.PUBLISHER_API,
    platformEventsAPI: process.env.PLATFORM_EVENTS_SERVICE,
    gothamistStories: process.env.GOTHAMIST_STORIES,
    wnycDonateURL: 'https://pledge3.wnyc.org/epledge/main?ref=button-donate-header',
    featureFlags: {
      'discover': true,
      'other-discover': process.env.OTHER_DISCOVER,
    },
    contentSecurityPolicy: {
      'connect-src': "'self' *.wnyc.net:* ws://*.wnyc.net:*",
      'style-src': "'self' 'unsafe-inline' *.wnyc.net:* *.wnyc.org cloud.typography.com fonts.googleapis.com www.google.com platform.twitter.com",
      'img-src': "'self' data: *",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' data: *",
      'object-src': "'self' *.wnyc.net:* *.wnyc.org *.moatads.com *.googlesyndication.com",
      'font-src': "'self' data: fonts.gstatic.com",
      'frame-src': "'self' *"
    },
    torii: {
      providers: {
        'facebook-connect': {
          appId: process.env.FB_APP || '151261804904925',
          scope: 'user_friends,email',
          version: 'v2.8'
        }
      }
    },
    alienDom: {
      toRemove: `${ALIEN_DOM_ROOT} > :not(.ember-view):not(#fb-root), ${ALIEN_DOM_ROOT} > head > link[rel=stylesheet]:not([href*=assets])`
    },
    hotjar: {
      id: 491820,
      enabled: environment === 'production',
      forceSSL: true
    },
    googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID || 'GTM-PM94N2'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    // ENV.LOG_LEGACY_LOADER = true;

    var mirageEnabled = !usingProxy();
    ENV['ember-cli-mirage'] = {
      // Mirage should be doing this automatically, but
      // it consideres the http-proxies we have in server/proxies
      // as a "proxy". We only want mirage to be disabled if we've
      // passed in --proxy to the command line
      enabled: mirageEnabled
    };

  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    ENV.queueAudioBumperURL = 'http://audio-bumper.com/thucyides.mp3';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.publisherAPI = 'http://example.com/api';
    ENV.adminRoot = 'http://admin.example.com';
    ENV.etagAPI = 'http://example.com/api/v1/browser_id/';
    ENV.webRoot = 'http://example.com';
    ENV.authAPI = 'http://example.com';
    ENV.membershipAPI = 'http://www.example.com';
    ENV.platformEventsAPI = 'http://example.com';
    ENV.gothamistStories = 'http://gothamist.com';
    ENV.APP.autoboot = false;

  }

  if (environment === 'production') {

  }

  return ENV;
};
