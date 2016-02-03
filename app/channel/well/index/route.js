// ember will send a route like /shows/bl/2 to the channel.well.index route with '2'
// as the navSlug parameter, when we really want to load the channel.page route
import Route from 'ember-route';

export default Route.extend({
  beforeModel() {
    let channelType = this.routeName.split('.')[0];

    const {navSlug} = this.paramsFor(`${channelType}.well`);
    if (/^\d+$/.test(navSlug)) {
      // navSlug is a page number
      return this.replaceWith(`${channelType}.page`, navSlug);
    } else {
      // navSlug is actually a navSlug
      // go to the channel.well.page route with a blanked out param for page #
      return this.replaceWith(`${channelType}.well.page`, navSlug, '');
    }
  }
});
