import Route from 'ember-route';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import ListingRouteMixin from 'wnyc-web-client/mixins/listing-route';

export default Route.extend(ListingRouteMixin, {
  model({ page_params }) {
    let {
      channelType,
      channelPathName
    } = getProperties(this, 'channelType', 'channelPathName');
    let { slug } = this.paramsFor(channelType);
    let [navSlug, page] = page_params.split('/');
    if (!page && /^\d+$/.test(navSlug)) {
      // navSlug is a page, so URL is something like shows/bl/5
      // we use recent_stories as the lookup for those stories
      page = navSlug;
      navSlug = 'recent_stories';
    }

    let id = `${channelPathName}/${slug}/${navSlug}/${page || 1}`;
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
