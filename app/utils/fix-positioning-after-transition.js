import { later } from 'ember-runloop';

export default function fixPositioningAfterTransition() {
  later(null, function() {
    window.$('.liquid-child').css('transform', 'initial').css('-moz-transform', 'initial').css('-webkit-transform', 'initial').css('overflow', 'hidden');
  }, 250);
}
