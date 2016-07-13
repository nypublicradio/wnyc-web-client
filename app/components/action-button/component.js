import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['rounded-caps-button'],
  classNameBindings: ['hasIcon:mod-with-icon'],
  iconPlacement: 'right',
  placeRight: Ember.computed('iconPlacement', function() {
    return this.get('iconPlacement') === 'right';
  }),
  placeLeft: Ember.computed.not('placeRight'),
  hasIcon: Ember.computed('icon', function() {
    return !!this.get('icon');
  })
});
