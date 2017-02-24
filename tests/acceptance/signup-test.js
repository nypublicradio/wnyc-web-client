import { test, skip } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import 'wnyc-web-client/tests/helpers/with-feature';

const fbResponseUser = {
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com",
  "picture": {
    "data": {
      "height": 320,
      "is_silhouette": true,
      "url": "https://example.com/avatar.jpg",
      "width": 508
    }
  },
  "id": "1234567890987654321"
};

moduleForAcceptance('Acceptance | signup', {
  beforeEach() {
    server.create('stream');
    server.create('user');
    window.FB = {
      api(route, options, callback) {
        if (route === '/me') {
          callback(fbResponseUser);
        }
      }
    };
  }
});

test('visiting /signup', function(assert) {
  visit('/signup');

  andThen(() => {
    assert.equal(currentURL(), '/signup');
  });
});

test('Sign up button is visible at load', function(assert) {
  visit('/signup');

  andThen(() => assert.equal(find('button[type=submit]:contains(Sign up)').length, 1));
});

test('Submitting the sign up form shows the thank you screen', function(assert) {
  visit('/signup');

  fillIn('input[name=given_name]', 'jane');
  fillIn('input[name=family_name]', 'doe');
  fillIn('input[name=email]', 'foo@example.com');
  fillIn('input[name=emailConfirmation]', 'foo@example.com');
  fillIn('input[name=typedPassword]', 'password1234567');
  click('button[type=submit]:contains(Sign up)');

  andThen(() => {
    assert.equal(find('.account-form-heading').text().trim(), 'Thanks for signing up!');
  });
});

skip('Successful facebook redirects and shows correct alert', function(assert) {
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.alert').text().trim(), "You’re now logged in via Facebook. You can update your information on your account page.");
  });
});

skip('Unsuccessful facebook login shows alert', function(assert) {
  withFeature('socialAuth');
  visit('/signup');

  click('button:contains(Sign up with Facebook)');

  andThen(() => {
    assert.equal(find('.alert').text().trim(), 'Unfortunately, we weren’t able to authorize your account');
  });
});
