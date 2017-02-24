/* jshint node: true */

module.exports = function(environment) {

  function usingProxy() {
    return !!process.argv.filter(function (arg) {
      return arg.indexOf('--proxy') === 0;
    }).length;
  }

  var ENV = {
    modulePrefix: 'wqxr-web-client',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    emberHifi: {
      connections: [{
        name: 'NativeAudio'
      }],
      alwaysUseSingleAudioElement: true
    },
    metricsAdapters: [{
      name: 'GoogleAnalytics',
      config: {
        id: process.env.GOOGLE_ANALYTICS || 'UA-46158613-1'
      },
    }, {
      name: 'NprAnalytics',
      config: {
        id: 'UA-18188937-11'
      }
    }, {
      name: 'GoogleTagManager',
      config: {
        id: process.env.GOOGLE_TAG_MANAGER_ID || (environment === 'production' ? 'GTM-PM94N2' : 'GTM-KJZRH7H')
      },
      environments: ['production']
    }],
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    // required for what's on widget compat
    exportApplicationGlobal: true,
    QP_WHITELIST: ['q', 'scheduleStation', 'next', 'n'], // see puppy/settings/base_settings.py

    sentry: {
      dsn: process.env.SENTRY_DSN,
      //debug: process.env.DEPLOY_TARGET !== 'production',
      development: environment !== 'production',
      includePaths: [
        process.env.WQXR_URL,
        /https?:\/\/(static|demo-static)\.wnyc\.org/,
        /https?:\/\/media\.wnyc\.org/,
        /https?:\/\/(demo2-wnyc)\.wqxr\.org/
      ],
      whitelistUrls: [
        /https?:\/\/(static|demo-static)\.wnyc\.org\/assets\/(vendor|wqxr-web-client)-.*/,
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
    queueAudioBumperURL: 'http://audio.wnyc.org/streambumper/streambumper000008_audio_queue.mp3',
    siteSlug: 'wqxr',
    siteName: 'WQXR',
    clientSlug: 'wqxr_web',
    // these are provided via a .env file or else by Django's EmberAdapter
    // fall back to demo GA key
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS || 'UA-46158613-1',
    nprGoogleAnalyticsKey: 'UA-18188937-11',
    googleAPIv3Key: process.env.GOOGLE_API_V3_KEY,
    typekit: { kitId: 'ifl2zxi' },
    wnycAPI: process.env.WQXR_API,
    showsDiscoverStation: "active-shows",
    showsAPIKey: "hummingbird",
    moreShowsDiscoverStation: "archived-shows",
    moreShowsAPIKey: "mammoth",
    wnycAdminRoot: process.env.WQXR_ADMIN_ROOT,
    wnycAuthAPI: process.env.AUTH_SERVICE,
    wnycAccountRoot: process.env.WQXR_ACCOUNT_ROOT,
    wnycEtagAPI: process.env.WQXR_ETAG_API,
    wnycStaticURL: process.env.WQXR_STATIC_URL,
    wnycURL: process.env.WQXR_URL,
    wnycDonateURL: 'https://pledge3.wqxr.org/donate/wqxr/main/onestep/?utm_source=wqxr&utm_medium=wqxr-support-300x75&utm_campaign=pledge&utm_content=pledge',
    wnycSvgURL: '/media/svg/',
    // put beta host at the root so it can be overridden by Django
    wnycBetaURL: process.env.WNYC_BETA_URL,
    featureFlags: {
      'social-auth': process.env.SOCIAL_AUTH,
    },
    betaTrials: {
      betaInviteLanding: '#full-page-transforms-wrapper',
      legacyNavLinkLanding: '#navigation-items > li:nth-child(2)',
      isBetaSite: false,
      preBeta: false,
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
    }
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

    ENV.betaTrials.legacyNavLinkLanding = '#ember-testing';
    ENV.betaTrials.betaInviteLanding = '#ember-testing';

    ENV.wnycAPI = 'http://example.com';
    ENV.wnycAccountRoot = 'http://example.com/account';
    ENV.wnycAdminRoot = 'http://admin.example.com';
    ENV.wnycEtagAPI = 'http://example.com/api/v1/browser_id/';
    ENV.wnycStaticURL = 'http://example.com/static';
    ENV.wnycURL = '//example.com';
    ENV.wnycBetaURL = 'http://example.com';
    ENV.wnycAuthAPI = 'http://example.com';
  }

  if (environment === 'production') {

  }

  return ENV;
};
