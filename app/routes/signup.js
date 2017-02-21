import Ember from 'ember';
import Route from 'ember-route';

export default Route.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  
  actions: {
    didTransition() {
      this.send('disableChrome');
    },
    willTransition() {
      this.send('enableChrome');
    },

    signupWithFb() {
      let authenticator = Ember.getOwner(this).lookup('authenticator:torii');
      authenticator.authenticate('facebook-connect').then(({access_token}) => {
        window.FB.api('/me', {fields: 'first_name,last_name,email,picture.width(500)'}, data => {
          // collect user attrs from FB api and send to auth
          let attrs = {
            providerToken: access_token,
            givenName: data.first_name,
            familyName: data.last_name,
            email: data.email,
            picture: data.picture.data.url,
            facebookId: data.id
          };
          let user = this.get('store').createRecord('user', attrs);
          user.save({adapterOptions: {provider: 'facebook-connect'}}).then(() => {
            // TODO: this opens a pop up twice, but how else to get an access token
            // and create a user withouth first triggering the sessionAuthenticated
            // event? if we authenticate first, the sessionAuthenticated event fires
            // which tries to load a user before we've had a chance to send the token
            // to the back end
            this.get('session').authenticate('authenticator:torii', 'facebook-connect');
          });
        });
      })
      .catch(() => {});
    }
  }
});
