import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),
  discoverPrefs: Ember.inject.service(),

  redirect(model, transition) {
    if (transition.targetName === "discover.edit.index") {
      this.transitionTo('discover.edit.topics');
    }
  },
  actions: {
    updateShowSelection(showSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('selectedShowSlugs', showSlugs);
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
      this.transitionTo('discover.index');
    }
  }
});
