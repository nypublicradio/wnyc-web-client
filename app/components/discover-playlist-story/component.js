import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['discover-playlist-story'],
  classNameBindings:['isLoading', 'isPlaying', 'isCurrentTrack'],
  mouseLeave() {
    this.set('isHovering', false);
  },
  mouseEnter() {
    this.set('isHovering', true);
  }
});
