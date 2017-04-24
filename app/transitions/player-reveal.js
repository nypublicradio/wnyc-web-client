import { animate, Promise } from 'liquid-fire';

export default function() {
  this.newElement.css('visibility', '');
  if (!this.newValue) {
    let player = this.newElement.find('.nypr-player');
    player.css({ transform: 'translateY(80px)' });
    let playerAnimationOptions = {easing: [0.17, 0.89, 0.39, 1.25], duration: 350};
    return Promise.all([
      animate(player, {translateY: [0, '80px']}, playerAnimationOptions)
    ]);
  }
}
