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
    }
  },
  
  model({ uslug, page, pageSize, ordering }) {
    let fields = 'item_type,slug,newsdate,segments,title,tease';
    let item_type = 'episode,article';
    return this.store.query('story', {
      page,
      uslug,
      ordering,
      item_type,
      page_size: pageSize,
      'fields[story]': fields
    });
  },
  setupController(controller) {
    this._super(...arguments);
    controller.set('uslug', this.paramsFor('archive').uslug);
  }
});
