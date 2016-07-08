import moveOver from "./move-over";
import { animate } from "liquid-fire";

export default function loadingTransition(opts={}) {
  let loadingScreen, otherScreen;

  if (this.oldElement.find('.discover-loading').length > 0) {
    // console.log('fade in loading screen, slide in other view')
    loadingScreen = this.oldElement;
    otherScreen = this.newElement;

    return animate(loadingScreen, {opacity: 0, duration: 0.5}, opts).then(() => {
      return moveOver.call(this, 'x', -1).then(() => {
        window.$('.liquid-child').css('transform', 'initial');
      });
  });
  }
  else {
    // console.log('slide out other view, fade in loading screen')
    loadingScreen = this.newElement;
    otherScreen = this.oldElement;

    loadingScreen.css('opacity', 0);
    return moveOver.call(this, 'x', 1).then(() => {
      return animate(loadingScreen, {opacity: 1, duration: 0.5}, opts).then(() => {
        window.$('.liquid-child').css('transform', 'initial');
      });
    });
  }

}
