import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),
  discoverQueue: Ember.inject.service(),
  listenActions: Ember.inject.service(),

  redirect(model, transition) {
    if (transition.targetName === "discover.edit.index") {
      this.transitionTo('discover.edit.topics');
    }
  },
  actions: {
    updateShowSelection(excludedShowSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('excludedShowSlugs', excludedShowSlugs);
    },
    noTopicsSelected(hasNotSelectedATopic) {
      this.controller.set('hasNotSelectedATopic', hasNotSelectedATopic);
      this.controller.set('showError', hasNotSelectedATopic);
    },
    updateTopicSelection(selectedTopicTags) {
      let prefs = this.get('discoverPrefs');
      prefs.set('selectedTopicTags', selectedTopicTags);
    },
    cancel() {
      this.get('discoverPrefs').discard();
      this.transitionTo('discover.index');
    },
    refresh() {
      if (this.controller.get('hasNotSelectedATopic')) {
        return;
      }
      this.get('discoverPrefs').save();
      this.get('discoverQueue').emptyQueue();
      this.transitionTo('discover.index');
    },
    loading(transition) {
      try {
        let controller = this.controllerFor('discover.index');
        controller.set('isLoading', true);
        transition.promise.finally(() => controller.set('isLoading', false));
      } catch(e) {}
      return true;
    }
  }
});
