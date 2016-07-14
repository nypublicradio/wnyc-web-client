export default function fixPositioningAfterTransition() {
  window.setTimeout(function() {
    window.$('.liquid-child').css('transform', 'initial').css('-moz-transform', 'initial').css('-webkit-transform', 'initial').css('overflow', 'hidden');
  }, 250);
}
