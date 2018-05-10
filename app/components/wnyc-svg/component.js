import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  svgPartial: computed(function() {
    let icon = this.get('icon');
    return icon ? `components/wnyc-svg/${icon}` : false;
  })
});
