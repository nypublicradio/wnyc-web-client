import { not } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: ['rounded-caps-button'],
  classNameBindings: ['hasIcon:mod-with-icon'],
  iconPlacement: 'right',
  placeRight: computed('iconPlacement', function() {
    return this.get('iconPlacement') === 'right';
  }),
  placeLeft: not('placeRight'),
  hasIcon: computed('icon', function() {
    return !!this.get('icon');
  })
});
