/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: 'production'
    },

    gzip: {
      filePattern: '\*\*/\*.{js,css,ico,map,xml,txt,svg,eot,ttf,woff,woff2}'
    },

    s3: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      bucket: process.env.AWS_BUCKET,
      region: process.env.AWS_REGION
    },

    redis: {
      filePattern: 'index.json',
      allowOverwrite: true
    },

    'ssh-tunnel': {
      username: process.env.SSH_TUNNEL_USERNAME,
      host: process.env.SSH_TUNNEL_HOST,
      dstHost: process.env.SSH_TUNNEL_DESTINATION_HOST,
      dstPort: process.env.SSH_TUNNEL_DESTINATION_PORT
    },

    sentry: {
      publicUrl: process.env.FINGERPRINT_PREPEND_URL,
      sentryUrl: 'https://sentry.wnyc.org',
      sentryOrganizationSlug: 'sentry',
      sentryProjectSlug: process.env.SENTRY_PROJECT,
      sentryApiKey: process.env.SENTRY_EMBER_SOURCEMAPS_KEY
    }
  };

  if (deployTarget === 'navigation') {
    ENV.redis.keyPrefix = deployTarget;
  }

  if (deployTarget === 'demo') {
    ENV.pipeline = { activateOnDeploy: true };
  }

  if (deployTarget === 'production') {
    // remove JS sourcemaps from production
    ENV.s3.filePattern = '**/*.{js,css,png,gif,ico,jpg,xml,txt,svg,swf,eot,ttf,woff,woff2}';
  }

  return ENV;
};
