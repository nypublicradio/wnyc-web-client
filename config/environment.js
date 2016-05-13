/* jshint node: true, multistr: true */

module.exports = function(environment) {

  function usingProxy() {
    return !!process.argv.filter(function (arg) {
      return arg.indexOf('--proxy') === 0;
    }).length;
  }

  var ENV = {
    modulePrefix: 'overhaul',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    'ember-metrics': {
      includeAdapters: ['google-analytics', 'data-warehouse']
    },
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
    // required for what's on widget compat
    exportApplicationGlobal: true,
    QP_WHITELIST: ['q', 'scheduleStation', 'next', 'n'], // see puppy/settings/base_settings.py

    sentry: {
      dsn: process.env.SENTRY_DSN,
      debug: process.env.DEPLOY_TARGET !== 'production',
      development: environment !== 'production',
      includePaths: [
        process.env.WNYC_URL,
        /https?:\/\/(static|demo-static)\.wnyc\.org/,
        /https?:\/\/media\.wnyc\.org/,
        /https?:\/\/(demo2-wnyc)\.wqxr\.org/
      ],
      whitelistUrls: [
        /https?:\/\/(static|demo-static)\.wnyc\.org\/assets\/(vendor|overhaul)-.*/,
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

    siteSlug: 'wnyc',
    renderGoogleAds: true,
    // these are provided via a .env file or else by Django's EmberAdapter
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS,
    googleAPIv3Key: process.env.GOOGLE_API_V3_KEY,
    wnycAPI: process.env.WNYC_API,
    wnycAccountRoot: process.env.WNYC_ACCOUNT_ROOT,
    wnycEtagAPI: process.env.WNYC_ETAG_API,
    wnycStaticURL: process.env.WNYC_STATIC_URL,
    wnycURL: process.env.WNYC_URL,
    wnycSvgURL: '/media/svg/',
    // put beta host at the root so it can be overridden by Django
    wnycBetaURL: process.env.WNYC_BETA_URL,
    featureFlags: {
      'django-page-routing': true,
      'persistent-player': true,
      'embedded-components': true,
      'site-chrome': false
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
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';

    ENV.renderGoogleAds = false;

    ENV.betaTrials.legacyNavLinkLanding = '#ember-testing';
    ENV.betaTrials.betaInviteLanding = '#ember-testing';

    ENV.googleAPIv3Key = '';
    ENV.googleAnalyticsKey = '';
    ENV.wnycAPI = 'http://example.com';
    ENV.wnycAccountRoot = 'http://example.com/account';
    ENV.wnycEtagAPI = 'http://example.com/api/v1/browser_id/';
    ENV.wnycStaticURL = 'http://example.com/static';
    ENV.wnycURL = '//example.com';
    ENV.wnycBetaURL = 'http://example.com';

  }

  if (environment === 'production') {
  }

  return ENV;
};
