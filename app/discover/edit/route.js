import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { get } from '@ember/object';

export default Route.extend({
  session:       service(),
  discoverPrefs: service(),
  discoverQueue: service(),
  metrics:       service(),

  redirect(model, transition) {
    if (transition.targetName === "discover.edit.index") {
      this.transitionTo('discover.edit.topics');
    }
  },
  actions: {
    noShowsSelected(hasNotSelectedAShow) {
      let parentController = this.controller;
      parentController.set('hasNotSelectedAShow', hasNotSelectedAShow);
      this.send('showError');
    },
    updateShowSelection(excludedShowSlugs) {
      let prefs = this.get('discoverPrefs');
      prefs.set('excludedShowSlugs', excludedShowSlugs);
    },
    noTopicsSelected(hasNotSelectedATopic) {
      let parentController = this.controller;
      parentController.set('hasNotSelectedATopic', hasNotSelectedATopic);
      this.send('showError');
    },
    updateTopicSelection(selectedTopicTags) {
      let prefs = this.get('discoverPrefs');
      prefs.set('selectedTopicTags', selectedTopicTags);
    },
    showError() {
      let parentController = this.controller;
      let error = parentController.get('hasNotSelectedATopic') || parentController.get('hasNotSelectedAShow');
      this.controller.set('showError', error);
    },
    cancel() {
      this.get('discoverPrefs').discard();
      this.transitionTo('discover.index');
    },
    refresh() {
      let parentController = this.controller;
      let error = parentController.get('hasNotSelectedATopic') || parentController.get('hasNotSelectedAShow');
      if (error) {
        return;
      }

      get(this, 'metrics').trackEvent('GoogleAnalytics', {
        category: 'Discover',
        action: 'Create Playlist in Discover',
        label: 'Refresh Playlist'
      });

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
