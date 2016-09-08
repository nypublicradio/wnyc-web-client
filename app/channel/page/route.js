import Route from 'ember-route';
import Ember from 'ember';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
const { Inflector } = Ember;

const inflect = new Inflector(Inflector.defaultRules);
import ListingRouteMixin from 'overhaul/mixins/listing-route';

export default Route.extend(ListingRouteMixin, {
  model({ page_params }) {
    let channelType = get(this, 'channelType');
    let { slug } = this.paramsFor(channelType);
    let [navSlug, page] = page_params.split('/');
    let id = `${inflect.pluralize(channelType)}/${slug}/${navSlug}/${page || 1}`;
    set(this, 'pageNumbers.totalPages', 0);

    return this.store.findRecord('api-response', id)
      .then(m => {
        // wait until models are loaded to keep UI consistent
        set(this, 'pageNumbers.page', Number(page) || 1);
        set(this, 'pageNumbers.totalPages', Number(get(m, 'totalPages')));

        return m;
      });
  }
});
