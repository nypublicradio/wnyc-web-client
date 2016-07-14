import moveOver from "./move-over";
import fixPositioningAfterTransition from '../utils/fix-positioning-after-transition';
export default function() {
  var el = document.getElementsByTagName('html');

  return window.$.Velocity(
    el, 'scroll', {offset: 0, duration: 100}
  ).then(() => {
    return moveOver.call(this, 'x', 1).then(() => {
      fixPositioningAfterTransition();
    });
  });
}
