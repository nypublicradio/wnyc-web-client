import { animate, Promise } from 'liquid-fire';
import Ember from 'ember';
const { $ } = Ember;

export default function() {
  this.newElement.css('visibility', '');
  if (!this.newValue) {
    let player = this.newElement.find('.persistent-player');
    let floatingQueueButton = this.oldElement.find('.persistent-queuebutton');
    player.css({ transform: 'translateY(80px)' });
    let playerAnimationOptions = {easing: [0.17, 0.89, 0.39, 1.25], duration: 350};
    return Promise.all([
      animate(floatingQueueButton, {opacity: [0, 1]}, {duration: 125}),
      animate($('nav .l-bottom'), {translateY: ['-80px', 0]}, playerAnimationOptions),
      animate(player, {translateY: [0, '80px']}, playerAnimationOptions)
    ]);
  }
}
