import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'button',
  classNames: ['persistent-queuebutton'],
  classNameBindings: ['isOpenModal', 'isFloating:floating-queuebutton'],
  queueLength: null,
  showModal: null,
  closeModal: null,
  isOpenModal: false,
  isFloating: false,
  
  click() {
    if (get(this, 'isOpenModal')) {
      get(this, 'closeModal')();
    } else {
      get(this, 'showModal')('queue-history');
    }
  },
  didUpdateAttrs({oldAttrs}) {
    this._super(...arguments);
    let newLength = get(this, 'queueLength');
    let oldLength = oldAttrs ? oldAttrs.queueLength.value : 0;

    // guard against users with disabled cookies
    if (typeof oldLength === 'undefined' || newLength <= oldLength) {
      return;
    }

    this.$().addClass('animate')
      .one('animationend', () => this.$().removeClass('animate'));
  },
});
