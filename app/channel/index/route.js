import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import ListingRouteMixin from 'overhaul/mixins/listing-route';

export default Route.extend(ListingRouteMixin, {
  model() {
    let page = 1;
    let channelType = get(this, 'channelType');
    let id = this.buildId(channelType, page);

    set(this, 'pageNumbers.totalPages', 0);

    return this.store.findRecord('api-response', id)
      .then(m => {
        // wait until models are loaded to keep UI consistent
        set(this, 'pageNumbers.page', page);
        set(this, 'pageNumbers.totalPages', get(m, 'totalPages'));

        return m;
      });
  }
});
