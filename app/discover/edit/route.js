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
    noShowsSelected(hasNotSelectedAShow) {
      this.controller.set('hasNotSelectedAShow', hasNotSelectedAShow);
      this.send('showError');
    },
    updateShowSelection(excludedShowSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('excludedShowSlugs', excludedShowSlugs);
    },
    noTopicsSelected(hasNotSelectedATopic) {
      this.controller.set('hasNotSelectedATopic', hasNotSelectedATopic);
      this.send('showError');
    },
    updateTopicSelection(selectedTopicTags) {
      let prefs = this.get('discoverPrefs');
      prefs.set('selectedTopicTags', selectedTopicTags);
    },
    showError() {
      let showError = this.controller.get('hasNotSelectedATopic') || this.controller.get('hasNotSelectedAShow');
      this.controller.set('showError', showError);
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
