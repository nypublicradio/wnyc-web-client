import EmberObject from '@ember/object';
import RSVP from 'rsvp';

export default EmberObject.extend({
  open() {
    return RSVP.Promise.reject();
  }
});
