import Ember from 'ember';
import {
    imageTemplate
} from '../../utils/image-processing';

const {
  get,
  set,
  Component
} = Ember;
const {htmlSafe} = Ember.String;

export default Component.extend({
  classNames: ['marquee'],
  didInitAttrs() {
      const bgColor = get(this, 'model.bgColor') || 'white';
      const marquee = get(this, 'model.marqueeImage');
      const urlString = imageTemplate([marquee.template, 1200,  200, marquee.crop, 99]);

      set(this, 'marqueeImageCSS', htmlSafe(`background: url(${urlString}) no-repeat center center ${bgColor};`));
      set(this, 'marqueeGradientCSS', htmlSafe(`background-image: -webkit-radial-gradient(rgba(255, 255, 255,0) 200px, ${bgColor} 620px)`));

      // TODO: until header is rendered via Ember
      // TODO: comment out until leaderboard can be taken off certain pages
      //$('#header').addClass('has-marquee')
  }
});
