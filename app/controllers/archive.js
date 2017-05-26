import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['page'],
  page: 1,
  count: Ember.computed('model.meta.pagination.last.number', 'model.meta.pagination.self.number', function() {
    let total = this.get('model.meta.pagination.last.number') || this.get('model.meta.pagination.self.number');
    if (!total) {
      return [];
    }
    return new Array(total+1).join('x').split('').map((e,i) => i+1);
  })
});
