import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'overhaul/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | accounts');

test('unauthenticated visiting /accounts', function(assert) {
  visit('/accounts');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

test('authenticated visiting /accounts', function(assert) {
  authenticateSession(this.application, {access_token: 'foo'});
  server.create('user');
  
  visit('/accounts');
  
  andThen(function() {
    assert.equal(currentURL(), '/accounts');
  });
});

test('can update user credentials', function(assert) {
  const FIRST = 'zzzzz';
  const LAST = 'xxxxx';
  const USER = 'yyyyy';
  const EMAIL = 'wwwww';
  let {
    name,
    family_name,
    username,
    email
  } = server.create('user');
   
  authenticateSession(this.application, {access_token: 'foo'});
  visit('/accounts');
  
  andThen(function() {
    assert.equal(findWithAssert('input[name=fullName]').val(), `${name} ${family_name}`, 'displays new fullname');
    assert.equal(findWithAssert('input[name=username]').val(), username, 'displays new username');
    assert.equal(findWithAssert('input[name=email]').val(), email, 'displays new email');
    assert.equal(findWithAssert('input[name=password]').val(), '******', 'displays password asterisks');
  });
  
  click('[data-test-selector="edit-button"]');
  
  andThen(function() {
    fillIn('input[name=name]', FIRST);
    fillIn('input[name=familyName]', LAST);
    fillIn('input[name=username]', USER);
    fillIn('input[name=email]', EMAIL);
  });
  
  click('[data-test-selector="save"]');
  
  andThen(function() {
    assert.equal(findWithAssert('input[name=fullName]').val(), `${FIRST} ${LAST}`, 'displays new fullname');
    assert.equal(findWithAssert('input[name=username]').val(), USER, 'displays new username');
    assert.equal(findWithAssert('input[name=email]').val(), EMAIL, 'displays new email');
    assert.equal(findWithAssert('input[name=password]').val(), '******', 'displays password asterisks');
  });
});
