import Ember from 'ember';
import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import ListingRouteMixin from 'overhaul/mixins/listing-route';
const { Inflector } = Ember;

const inflect = new Inflector(Inflector.defaultRules);

export default Route.extend(ListingRouteMixin, {
  model() {
    let channelType = get(this, 'channelType');
    let { slug } = this.paramsFor(channelType);
    let navSlug = this._getNavSlug(channelType);
    
    let id = `${inflect.pluralize(channelType)}/${slug}/${navSlug || 'recent_stories'}/${1}`;

    set(this, 'pageNumbers.totalPages', 0);

    return this.store.findRecord('api-response', id)
      .then(m => {
        // wait until models are loaded to keep UI consistent
        set(this, 'pageNumbers.page', 1);
        set(this, 'pageNumbers.totalPages', Number(get(m, 'totalPages')));

        return m;
      });
  }
});
