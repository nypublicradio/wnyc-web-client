export function initialize(application) {
  application.inject('controller', 'pageNumbers', 'service:page-numbers');
}

export default {
  name: 'page-numbers',
  initialize: initialize
};
