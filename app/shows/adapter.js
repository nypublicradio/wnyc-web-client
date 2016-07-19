import ApplicationAdapter from 'overhaul/adapters/application';

export default ApplicationAdapter.extend({
  buildURL() {
    let url = this._super(...arguments);
    return url.replace(/([^\/])$/, '$1/');
  }
});
