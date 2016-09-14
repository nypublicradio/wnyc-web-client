import { animate, Promise } from 'liquid-fire';
import Ember from 'ember';
const { $ } = Ember;

export default function() {
  this.newElement.css('visibility', '');
  if (!this.newValue) {
    let notification = this.newElement.find('.notification');
    notification.css({ transform: 'translateY(0)' });
    let notificationAnimationOptions = {easing: [0.17, 0.89, 0.39, 1.25], duration: 350};
    return animate(notification, {translateY: ['80px', 0]}, notificationAnimationOptions);
  }
}
