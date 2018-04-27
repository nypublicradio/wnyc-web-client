import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  session: service(),
  isPopupOpen: false,
  classNameBindings: ['isPopupOpen'],
  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
