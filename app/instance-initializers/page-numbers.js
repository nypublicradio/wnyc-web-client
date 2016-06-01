export function initialize(appInstance) {
  appInstance.inject('controller', 'pageNumbers', 'service:page-numbers');
}

export default {
  name: 'page-numbers',
  initialize: initialize
};
