export function initialize(/* appInstance */) {
  if (window.cxApi) {
    // initializing google experiments api here
    // so an experiment variation is always chosen.
    window.cxApi.chooseVariation();
  }
}

export default {
  name: 'google-experiments',
  initialize
};
