import { moduleFor, test } from 'ember-qunit';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';

moduleFor('service:session', 'Unit | Service | session', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'adapter:user',
    'serializer:user'
  ],
  beforeEach() {
    startMirage(this.container);
    server.create('user');
  },
  afterEach() {
    server.shutdown();
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('createUserForAuthenticatedProvider', function(assert) {
  let done = assert.async();
  assert.expect(6);

  const TOKEN = 'abc';
  const GIVEN_NAME = 'Jane';
  const FAMILY_NAME = 'Doe';
  const EMAIL = 'janedoe@example.com';
  const AVATAR = 'abc';
  const ID = 'http://example.com/avatar.url';

  window.FB = {
    api(route, fields, cb) {
      cb({
        first_name: GIVEN_NAME,
        last_name: FAMILY_NAME,
        email: EMAIL,
        picture: {
          data: {
            url: AVATAR
          }
        },
        id: ID
      });
    }
  };

  let service = this.subject();
  service.set('data', {
    authenticated: {
      provider: 'facebook-connect',
      'access_token': TOKEN
    }
  });

  service.createUserForAuthenticatedProvider().then((user) => {
    assert.equal(user.get('providerToken'), TOKEN);
    assert.equal(user.get('givenName'), GIVEN_NAME);
    assert.equal(user.get('familyName'), FAMILY_NAME);
    assert.equal(user.get('email'), EMAIL);
    assert.equal(user.get('picture'), AVATAR);
    assert.equal(user.get('facebookId'), ID);
    done();
  })
  .catch(() => {
    done();
  });
});
