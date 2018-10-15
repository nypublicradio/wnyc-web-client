import config from '../config/environment';

export function initialize(appInstance) {
  // for now, nypr-ads and wnyc-web-client don't
  // have native support for either distinct
  // account IDs or 'test' ad unit prefixes
  // so the googleDFPPrefix defined in either
  // .env or otherwise in the environment provides
  // a crude way to do both at once without breaking
  // anything, as the default (in environment.js)
  // will just pass in a properly-formatted string
  // TODO: get required DFP account ID, throw
  // error if empty, take optional 'test prefix'
  // path, construct proper string for nypr-ads
  let googleDFPPrefix = config.googleDFPPrefix;
  appInstance.register('dfp-config:main', googleDFPPrefix, { singleton: true, instantiate: false });
  appInstance.inject('controller', 'googleDFPPrefix', 'dfp-config:main');

}

export default {
  name: 'dfp-config',
  initialize
};
