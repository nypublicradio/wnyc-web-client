import EmberObject from '@ember/object';
import RSVP from 'rsvp';

export default EmberObject.extend({
  open() {
    return RSVP.Promise.resolve({
       accessToken: 'abcdef',
       expiresIn: 6000,
       userId: '123456',
    });
  }
});
