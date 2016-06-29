import Route from 'ember-route';
import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
const { Inflector } = Ember;

const inflector = new Inflector(Inflector.defaultRules);
import ListingRouteMixin from 'overhaul/mixins/listing-route';

export default Route.extend(ListingRouteMixin, {
  model({ page }) {
    let routes = this.routeName.split('.');
    let { slug } = this.paramsFor(`${routes[0]}`);
    let { navSlug } = this.paramsFor(`${routes[0]}.${routes[1]}`);
    let id = `${inflector.pluralize(routes[0])}/${slug}/${navSlug}/${page}`;
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
