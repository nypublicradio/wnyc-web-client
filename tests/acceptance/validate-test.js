import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import { currentSession } from 'wnyc-web-client/tests/helpers/ember-simple-auth';
// import { Response } from 'ember-cli-mirage';
// import config from 'wnyc-web-client/config/environment';

moduleForAcceptance('Acceptance | validate');

test('visiting /validate with no params', function(assert) {
  visit('/validate');

  return andThen(() => {
    assert.equal(currentURL(), '/validate');
    assert.equal(find('h2').text().trim(), 'Oops!');
  });
});

test('visiting /validate and logging in', function(assert) {
  server.create('user');
  visit('/validate?username=test&confirmation=123');

  andThen(() => {
    assert.equal(currentURL(), '/validate?username=test&confirmation=123');
    assert.equal(find('.alert-success').text().trim(), 'Your email has been verified and your online account is now active.');
    assert.equal(find('h2').text().trim(), 'Log in to WNYC');
  });

  fillIn('input[name=email]', 'user@example.com');
  fillIn('input[name=password]', 'password1');
  click('button:contains(Log in)');

  return andThen(() => {
    assert.ok(currentSession(this.application).get('isAuthenticated'));
  });
});
