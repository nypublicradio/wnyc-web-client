import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  svgPartial: Ember.computed(function() {
    let icon = this.get('icon');
    return icon ? `components/wnyc-svg/${icon}` : false;
  })
});
