import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  buildURL() {
    let url = this._super(...arguments);
    return url + '/';
  }
});
