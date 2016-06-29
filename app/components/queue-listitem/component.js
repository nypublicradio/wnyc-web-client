import Component from 'ember-component';
import computed, { readOnly } from 'ember-computed';

export default Component.extend({
  attributeBindings:  ['data-id'],
  'data-id':          readOnly('dataId'),

  state: computed('isCurrent', 'playState', function() {
    return this.get('isCurrent') ? this.get('playState') : null;
  })
});
