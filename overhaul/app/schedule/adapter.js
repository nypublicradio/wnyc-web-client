import ApplicationAdapter from '../adapters/application';

export default ApplicationAdapter.extend({
  pathForType: function(type) {
    return type;
  },
  buildURL() {
    let url = this._super(...arguments);
    return url.replace(/([^\/])$/, '$1/');
  },
});

