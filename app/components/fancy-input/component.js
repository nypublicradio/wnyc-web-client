import Component from 'ember-component';
import { and, or } from 'ember-computed';
import set from 'ember-metal/set';

export default Component.extend({
  classNameBindings: ['hasError'],
  touched: false,
  submitted: false,
  showError: or('touched', 'submitted'),
  hasError: and('errors', 'showError'),
  actions: {
    setTouched() {
      set(this, 'touched', true);
    }
  }
});
