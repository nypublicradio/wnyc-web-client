import Component from 'ember-component';
import { and } from 'ember-computed';
import set from 'ember-metal/set';

export default Component.extend({
  classNameBindings: ['hasError'],
  touched: false,
  hasError: and('errors', 'touched'),
  actions: {
    setTouched() {
      set(this, 'touched', true);
    }
  }
});
