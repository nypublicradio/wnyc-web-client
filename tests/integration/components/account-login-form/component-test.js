import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
\import wait from 'ember-test-helpers/wait';
import sinon from 'sinon';

moduleForComponent('account-login-form', 'Integration | Component | account login form', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{account-login-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});

test('submitting the form passes the login values to the authenticator', function(assert) {
  let authenticate = sinon.stub().returns(Promise.reject({}));
  let session = {authenticate};
  this.set('session', session);
  this.render(hbs`{{account-login-form session=session}}`);

  let testEmail = 'test@email.com';
  let testPassword = 'password123';

  this.$('label:contains(Email) + input').val(testEmail);
  this.$('label:contains(Email) + input').blur();
  this.$('label:contains(Password) + input').val(testPassword);
  this.$('label:contains(Password) + input').blur();
  this.$('button:contains(Log in)').click();

  return wait().then(() => {
    assert.equal(authenticate.callCount, 1);
    assert.deepEqual(authenticate.firstCall.args, ['authenticator:nypr', testEmail, testPassword]);
  });
});

test('successful login calls routing service to redirect', function(assert) {
  let authenticate = sinon.stub().returns(Promise.resolve());
  let session = {authenticate};
  let transitionTo = sinon.spy();
  let routing = {transitionTo};
  this.set('session', session);
  this.set('routing', routing);
  this.render(hbs`{{account-login-form session=session routing=routing}}`);

  let testEmail = 'test@email.com';
  let testPassword = 'password123';

  this.$('label:contains(Email) + input').val(testEmail);
  this.$('label:contains(Email) + input').blur();
  this.$('label:contains(Password) + input').val(testPassword);
  this.$('label:contains(Password) + input').blur();
  this.$('button:contains(Log in)').click();

  return wait().then(() => {
    assert.ok(transitionTo.called);
  });
});


test('failed login does not redirect', function(assert) {
  let authenticate = sinon.stub().returns(Promise.reject());
  let session = {authenticate};
  let transitionTo = sinon.spy();
  let routing = {transitionTo};
  this.set('session', session);
  this.set('routing', routing);
  this.render(hbs`{{account-login-form session=session routing=routing}}`);

  let testEmail = 'test@email.com';
  let testPassword = 'password123';

  this.$('label:contains(Email) + input').val(testEmail);
  this.$('label:contains(Email) + input').blur();
  this.$('label:contains(Password) + input').val(testPassword);
  this.$('label:contains(Password) + input').blur();
  this.$('button:contains(Log in)').click();

  return wait().then(() => {
    assert.ok(transitionTo.notCalled);
  });
});
