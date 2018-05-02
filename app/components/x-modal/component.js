import Component from '@ember/component';
import { get } from '@ember/object';
import $ from 'jquery';

export default Component.extend({
  classNames: ['l-sliding-modal', 'l-modal--shadow'],
  didInsertElement() {
    $('body').addClass('is-open-modal');
  },
  willDestroyElement() {
    $('body').removeClass('is-open-modal');
  },
  actions: {
    closeModal() {
      get(this, 'closeModal')();
    }
  }
});
