export function mockExperimentalGroup(variation) {
  window.cxApi = window.cxApi || {};
  window.cxApi.chooseVariation = () => variation;
}
