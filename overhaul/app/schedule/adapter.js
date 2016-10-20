import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace: 'api/v3',
  pathForType: function(type) {
    return type;
  },
});

