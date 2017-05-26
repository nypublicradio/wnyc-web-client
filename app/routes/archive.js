import Route from 'ember-route';

export default Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    }
  },
  
  model({ uslug, page }) {
    return this.store.query('story', {page, uslug, ordering: '-newsdate'});
  }
});
