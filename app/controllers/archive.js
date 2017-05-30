import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Controller.extend({
  queryParams: [
    'page',
    'pageSize',
    'year',
    'month',
    'day',
    {ordering: 'sort'},
  ],
  page: 1,
  ordering: '-newsdate',
  pageSize: 10,
  year: null,
  month: null,
  day: null,
  
  sortOptions: [{
    label: 'Newest to Oldest',
    value: '-newsdate'
  }, {
    label: 'Oldest to Newst',
    value: 'newsdate'
  }],
  
  pageOptions: [10, 25, 50, 100, 500],
  
  years: computed('model.meta.dates', function() {
    return Object.keys(this.get('model.meta.dates')).reverse();
  }),
  
  months: computed('year', 'model.meta.dates', function() {
    return Object.keys(this.get('model.meta.dates')[this.get('year')]);
  }),
  
  days: computed('year', 'month', 'model.meta.dates', function() {
    let { year, month } = this.getProperties('year', 'month');
    return this.get('model.meta.dates')[year][month].map(Number).sort((a, b) => a - b);
  }),
  
  actions: {
    updateOrder(e) {
      this.set('ordering', e.target.value);
    },
    updatePageSize(e) {
      this.set('pageSize', e.target.value);
    }
  }
});
