import Route from 'ember-route';

export default Route.extend({
  queryParams: {
    page: {
      refreshModel: true
    },
    ordering: {
      refreshModel: true
    },
    pageSize: {
      refreshModel: true
    },
    year: {
      refreshModel: true
    },
    month: {
      refreshModel: true
    },
    day: {
      refreshModel: true
    }
  },
  
  model({ uslug, page, pageSize, ordering, year, month, day }) {
    let fields = 'item_type,slug,newsdate,segments,title,tease';
    let item_type = 'episode,article';
    return this.store.query('story', {
      page,
      uslug,
      ordering,
      item_type,
      year,
      month,
      day,
      meta: 'dates',
      page_size: pageSize,
      'fields[story]': fields
    });
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('uslug', this.paramsFor('archive').uslug);
  }
});
