import Component from 'ember-component';
import { imageTemplate } from 'wqxr-web-client/helpers/image-template';
import { htmlSafe } from 'ember-string';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  classNames: ['marquee'],
  init() {
    this._super(...arguments);

    let bgColor = get(this, 'model.bgColor') || 'white';
    let marquee = get(this, 'model.marqueeImage');
    let urlString = imageTemplate([get(marquee, 'template'), 1200,  200, get(marquee, 'crop'), 99]);

    set(this, 'marqueeImageCSS', htmlSafe(`background: url(${urlString}) no-repeat center center ${bgColor};`));
    set(this, 'marqueeGradientCSS', htmlSafe(`background-image: radial-gradient(rgba(255, 255, 255,0) 200px, ${bgColor} 620px);`));
  }
});
