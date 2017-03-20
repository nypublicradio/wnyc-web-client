import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Object.extend({
  open() {
    return RSVP.Promise.resolve({
       accessToken: 'abcdef',
       expiresIn: 6000,
       userId: '123456',
    });
  }
});
