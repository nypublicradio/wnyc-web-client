import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Object.extend({
  open() {
    return RSVP.Promise.reject();
  }
});
