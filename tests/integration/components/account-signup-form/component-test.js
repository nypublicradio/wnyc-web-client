import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('account-signup-form', 'Integration | Component | account signup form', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{account-login-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});

test('submitting the form tries to save values on a new user model', function(assert) {
  let done = assert.async();
  assert.expect(3);
  let save = sinon.stub().returns(Promise.resolve({}));
  let fakeUser = {save};
  let createRecord = sinon.stub().returns(fakeUser);
  let store = {createRecord};
  this.set('store', store);
  this.render(hbs`{{account-signup-form store=store}}`);

  let testFirstName = 'Test';
  let testLastName = 'User';
  let testEmail = 'test@email.com';
  let testPassword = 'password123';

  this.$('label:contains(First Name) + input').val(testFirstName).change();
  this.$('label:contains(Last Name) + input').val(testLastName).change();
  this.$('label:contains(Email) + input').val(testEmail).change();
  this.$('label:contains(Confirm Email) + input').val(testEmail).change();
  this.$('label:contains(Password) + input').val(testPassword).change();
  this.$('button:contains(Sign up)').click();

  wait().then(() => {
    delete fakeUser.save;
    assert.equal(createRecord.callCount, 1);
    assert.equal(save.callCount, 1);
    assert.deepEqual(fakeUser, {
      givenName: testFirstName,
      familyName: testLastName,
      email: testEmail,
      emailConfirmation: testEmail,
      typedPassword: testPassword
    });
    done();
  });
});
