import { moduleForComponent, test, skip } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';
import ENV from 'wnyc-web-client/config/environment';
import { startMirage }  from 'wnyc-web-client/initializers/ember-cli-mirage';
import sinon from 'sinon';

moduleForComponent('account-signup-form', 'Integration | Component | account signup form', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{account-login-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});

test('submitting the form tries to save values on a new user model', function(assert) {
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

  return wait().then(() => {
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
  });
});

skip('submitting the form sends a post to the api', function(assert) {
  let testFirstName = 'Test';
  let testLastName = 'User';
  let testEmail = 'test@email.com';
  let testPassword = 'password123';

  let requests = [];
  let url = `${ENV.wnycAuthAPI}/v1/user`;
  this.server.post(url, (schema, request) => {
    requests.push(request);
    return {};
  }, 200);

  this.render(hbs`{{account-signup-form}}`);

  this.$('label:contains(First Name) + input').val(testFirstName).change();
  this.$('label:contains(Last Name) + input').val(testLastName).change();
  this.$('label:contains(Email) + input').val(testEmail).change();
  this.$('label:contains(Confirm Email) + input').val(testEmail).change();
  this.$('label:contains(Password) + input').val(testPassword).change();
  this.$('button:contains(Sign up)').click();

  return wait().then(() => {
    assert.equal(requests.length, 1);
    assert.deepEqual(JSON.parse(requests[0].requestBody), {
      given_name: testFirstName,
      family_name: testLastName,
      email: testEmail,
      password: testPassword,
      preferred_username: null
    });
  });
});
