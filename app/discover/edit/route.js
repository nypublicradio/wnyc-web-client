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
    updateTopicSelection(topicTags) {
      let prefs = this.get('discoverPrefs');
      prefs.set('selectedTopicTags', topicTags);
    },
    cancel() {
      this.get('discoverPrefs').discard();
      this.transitionTo('discover.index');
    },
    refresh() {
      this.get('discoverPrefs').save();
      this.get('discoverQueue').emptyQueue();
      this.transitionTo('discover.index');
    }
  }
});
