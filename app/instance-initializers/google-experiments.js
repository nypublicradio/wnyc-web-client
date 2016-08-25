import config from 'overhaul/config/environment';

export function initialize(/* appInstance */) {
  if (window.cxApi) {
    config.experimentalGroup = window.cxApi.chooseVariation();
  }
}

export default {
  name: 'google-experiments',
  before: 'metrics',
  initialize
};
