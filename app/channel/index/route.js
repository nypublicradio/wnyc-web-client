import Route from 'ember-route';

export default Route.extend({
  beforeModel() {
    let channelType = this.routeName.split('.')[0];
    this.replaceWith(`${channelType}.page`, '');
  }
});
