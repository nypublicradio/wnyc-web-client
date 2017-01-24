import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | validate');

test('visiting /validate with no params', function(assert) {
  visit('/validate');

  return andThen(function() {
    assert.equal(currentURL(), '/validate');
    assert.equal(find('h2').text().trim(), 'Oops!');
  });
});

test('visiting /validate and logging in', function(assert) {
  let user = server.create('user');
  visit('/validate?username=test&confirmation=123');

  andThen(function() {
    assert.equal(currentURL(), '/validate?username=test&confirmation=123');
    assert.equal(find('.alert-success').text().trim(), 'Your email has been verified and your online account is now active.');
    assert.equal(find('h2').text().trim(), 'Log in to WNYC');
  });

  fillIn('input[name=email]', user.email);
  fillIn('input[name=password]', 'password1');
  click('button:contains(Log in)');

  return andThen(function() {
    assert.equal(find('.user-nav-greeting').text().trim(), `Hi, ${user.given_name}`);
  });
});
