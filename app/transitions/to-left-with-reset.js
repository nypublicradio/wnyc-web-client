import moveOver from "./move-over";

export default function() {
  var el = document.getElementsByTagName('html');

  return window.$.Velocity(
    el, 'scroll', {offset: 0, duration: 100}
  ).then(() => {
    return moveOver.call(this, 'x', -1).then(() => {
      window.$('.liquid-child').css('transform', 'initial');
    });
  });
}
