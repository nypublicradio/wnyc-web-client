import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import ListingRouteMixin from 'wnyc-web-client/mixins/listing-route';

export default Route.extend(ListingRouteMixin, {
  model() {
    let {
      channelType,
      channelPathName 
    } = getProperties(this, 'channelType', 'channelPathName');
    let { slug } = this.paramsFor(channelType);
    let navSlug = this._getNavSlug(channelType);
    
    let id = `${channelPathName}/${slug}/${navSlug || 'recent_stories'}/${1}`;

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
