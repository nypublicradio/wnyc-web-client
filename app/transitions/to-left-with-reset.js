import moveOver from "./move-over";
import fixPositioningAfterTransition from '../utils/fix-positioning-after-transition';
import velocity from 'velocity';

export default function() {
  var el = document.getElementsByTagName('html');

  return velocity(
    el, 'scroll', {offset: 0, duration: 100}
  ).then(() => {
    return moveOver.call(this, 'x', -1).then(() => {
      fixPositioningAfterTransition();
    });
  });
}
