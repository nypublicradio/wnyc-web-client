window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Using store.find(type) has been deprecated. Use store.findAll(type) to retrieve all records for a given type." },
    { handler: "silence", matchMessage: "The default behavior of shouldReloadAll will change in Ember Data 2.0 to always return false when there is at least one \"story\" record in the store. If you would like to preserve the current behavior please override shouldReloadAll in your adapter:application and return true." },
    { handler: "silence", matchMessage: /A property of .* was modified inside the didInsertElement hook. You should never change properties on components, services or models during didInsertElement because it causes significant performance degradation./ },
    { handler: "silence", matchMessage: "Your custom serializer uses the old version of the Serializer API, with `extract` hooks. Please upgrade your serializers to the new Serializer API using `normalizeResponse` hooks instead." },
    { handler: "silence", matchMessage: "The default behavior of shouldReloadAll will change in Ember Data 2.0 to always return false when there is at least one \"comment\" record in the store. If you would like to preserve the current behavior please override shouldReloadAll in your adapter:application and return true." },
    { handler: "silence", matchMessage: "`RESTSerializer.normalizeHash` has been deprecated. Please use `serializer.normalize` to modify the payload of single resources." },
    { handler: "silence", matchMessage: "Ember.keys is deprecated in favor of Object.keys" },
    { handler: "silence", matchMessage: "Calling Ember.get without a target object has been deprecated, please specify a target object."  },
  ]
};
