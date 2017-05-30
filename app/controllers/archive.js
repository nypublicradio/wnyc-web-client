import Controller from 'ember-controller';
import computed from 'ember-computed';

export default Controller.extend({
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
    label: 'Oldest to Newest',
    value: 'newsdate'
  }],
  
  pageOptions: [10, 25, 50, 100, 500],
  
  years: computed('model.meta.dates', function() {
    return Object.keys(this.get('model.meta.dates')).reverse();
  }),
  showYears: computed('year', 'month', 'day', function() {
    let { year, month, day } = this.getProperties('year', 'month', 'day');
    return !year && !month && !day;
  }),
  
  months: computed('year', 'model.meta.dates', function() {
    return Object.keys(this.get('model.meta.dates')[this.get('year')]);
  }),
  showMonths: computed('year', 'month', 'day', function() {
    let { year, month, day } = this.getProperties('year', 'month', 'day');
    return year && !month && !day;
  }),
  
  days: computed('year', 'month', 'model.meta.dates', function() {
    let { year, month } = this.getProperties('year', 'month');
    return this.get('model.meta.dates')[year][month].map(Number).sort((a, b) => a - b);
  }),
  showDays: computed('year', 'month', 'day', function() {
    let { year, month, day } = this.getProperties('year', 'month', 'day');
    return year && month && !day;
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
