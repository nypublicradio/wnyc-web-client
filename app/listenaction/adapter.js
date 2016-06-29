import ApplicationAdapter from 'overhaul/adapters/application';

export default ApplicationAdapter.extend({
  ajaxOptions() {
    let options = this._super(...arguments);
    options.xhrFields = { withCredentials: true };
    return options;
  }
});
