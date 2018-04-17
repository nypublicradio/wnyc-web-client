require('dotenv').config();

module.exports = (on, config) => {
  // Pull baseUrl from the .env file (if baseUrl isn't configured), with a
  // fallback:
  config.baseUrl =
    config.baseUrl || process.env.WNYC_URL || 'http://localhost:4200';

  // Drop all environment variables into Cypress config.env
  Object.keys(process.env).forEach(envkey => {
    if (envkey.indexOf('PROD') < 0 || envkey.indexOf('PROD')) {
      config.env[envkey] = process.env[envkey];
    }
  });

  return config;
};
