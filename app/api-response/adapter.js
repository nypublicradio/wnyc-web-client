import ApplicationAdapter from '../adapters/application';

export default ApplicationAdapter.extend({
  pathForType() { return 'channel'; },
  buildURL() {
    let url = this._super(...arguments);
    return decodeURIComponent(url);
  }
});
