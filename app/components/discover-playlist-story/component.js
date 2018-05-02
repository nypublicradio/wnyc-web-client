import Component from '@ember/component';

export default Component.extend({
  classNames:['discover-playlist-story'],
  classNameBindings:['isLoading', 'isPlaying', 'isCurrentTrack'],
  mouseLeave() {
    this.set('isHovering', false);
  },
  mouseEnter() {
    this.set('isHovering', true);
  }
});
