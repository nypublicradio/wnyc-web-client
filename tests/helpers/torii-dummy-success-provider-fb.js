import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Object.extend({
  open() {
    let data = {
       accessToken: 'abcdef',
       expiresIn: 6000,
       userId: '123456',
       provider: 'facebook-connect'
    };
    let userAttrs = {
        providerToken: "abcdefg",
        givenName: "Jane",
        familyName: "Doe",
        email: "janedoe@example.com",
        picture: "https://example.com/avatar.jpg",
        facebookId: "1234567890987654321"
      };
    return RSVP.Promise.resolve({data, userAttrs});
  }
});
