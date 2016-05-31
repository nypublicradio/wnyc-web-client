import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['discover-playlist-container'],
  sortedStories: Ember.computed.or('customSortedStories', 'stories'),

  actions: {
    reorderItems(itemModels, draggedModel) {
      this.set('customSortedStories', itemModels);
      this.set('justDragged', draggedModel);
    }
  }
});
