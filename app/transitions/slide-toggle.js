import { animate, Promise } from "liquid-fire";


export default function slideToggle() {
  const animationSettings = {
    easing: [0.2, 0.2, 0.2, 0.2],
    duration: 200
  };
  let oldStick = this.oldElement.find('.switch');
  let oldText = this.oldElement.find('.label');
  let animateSetting = {};

  if (this.newValue) {
    oldStick.css('order', '2');
    oldText.css('order', '1');
    this.newElement.find('.autoplay-toggle').css('backgroundColor', '#BBB');
    this.newElement.find('.label').css('order', '2');
    this.newElement.find('.switch').css('order', '1');
    animateSetting.toggle = { translateX: ['-35px', 0] };
    animateSetting.text = { translateX: [0, '35px'] };
    animateSetting.body = { backgroundColor: ['#BBB', '#DE1E3D'] };
  } else {
    this.oldElement.find('.autoplay-toggle').css({
      backgroundColor: '#BBB'
    });
    this.newElement.find('.autoplay-toggle').css('backgroundColor', '#DE1E3D');
    oldText.css('order', '2');
    oldStick.css('order', '1');
    this.newElement.find('.label').css({order: '1'});
    this.newElement.find('.switch').css({order: '2'});
    animateSetting.body = { backgroundColor: ['#DE1E3D', '#BBB'] };
    animateSetting.toggle = { translateX: ['35px', 0] };
    animateSetting.text = { translateX: [0, '-35px'] };
  }

  this.newElement.css('visibility', '');

  return Promise.all([
    animate(oldStick, animateSetting.toggle, animationSettings),
    animate(oldText, animateSetting.text, animationSettings),
    animate(this.oldElement.find('.autoplay-toggle'), animateSetting.body, animationSettings)
  ]);
}
