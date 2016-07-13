import { animate } from 'liquid-fire';
import $ from 'jquery';

export default function() {
  let el;
  let translateY;
  let finalTransform;
  let animationOptions = {
    duration: 300,
    easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)'
  };
  if (this.newValue) {
    el = this.newElement;
    translateY = ['0%', '100%'];
    finalTransform =  'translateY(0%)';
    // incoming transition, correct z-index issues before slide
    $('.django-content').css({ position: 'relative' });
  } else {
    el = this.oldElement;
    translateY = ['100%', '0%'];
    finalTransform = 'translateY(100%)';
    // outgoing transition, make django-content visible before slide
    $('.django-content').css({ visibility: 'visible' });
  }

  el.css({
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0
  });

  return animate(el, {translateY}, animationOptions)
    .then(() => {
      el.css('transform', finalTransform);
      if (this.newValue && this.newElement) {
        // sliding up, hide django-content for mobile compat
        $('.django-content').css({ visibility: 'hidden' });
      } else if (this.newElement) {
        // sliding down, reset transform/stacking order
        $('.django-content').css({ position: '' });
      }
    });
}
