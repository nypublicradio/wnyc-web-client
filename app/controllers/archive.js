import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'page',
    'pageSize',
    {ordering: 'sort'},
  ],
  page: 1,
  ordering: '-newsdate',
  pageSize: 10,
  
  sortOptions: [{
    label: 'Newest to Oldest',
    value: '-newsdate'
  }, {
    label: 'Oldest to Newst',
    value: 'newsdate'
  }],
  
  pageOptions: [10, 25, 50, 100, 500],
  
  actions: {
    updateOrder(e) {
      this.set('ordering', e.target.value);
    },
    updatePageSize(e) {
      this.set('pageSize', e.target.value);
    }
  }
});
