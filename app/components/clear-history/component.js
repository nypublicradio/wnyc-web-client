import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  listens:            service('listen-history'),

  isConfirming:       false,

  classNames:         ['clearhistory'],
  classNameBindings:  ['isConfirming'],

  actions: {
    showConfirmation() {
      set(this, 'isConfirming', true);
    },
    cancel() {
      set(this, 'isConfirming', false);
    },
    clearHistory() {
      get(this, 'listens').clearHistory();
      set(this, 'isConfirming', false);
    }
  }
});
