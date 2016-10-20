import ApplicationAdapter from '../adapters/application';

export default ApplicationAdapter.extend({
  pathForType: function(type) {
    return type;
  },
});

