import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['next', 'q'],
  next: null,
  q: null
});
