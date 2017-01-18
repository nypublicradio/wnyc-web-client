import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ENV from 'wnyc-web-client/config/environment';
import { startMirage }  from 'wnyc-web-client/initializers/ember-cli-mirage';
import wait from 'ember-test-helpers/wait';

moduleForComponent('account-reset-password-form', 'Integration | Component | account reset password form', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{account-reset-password-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});

test('submitting the form sends the correct values to the correct endpoint', function(assert) {
  let testEmail = 'test@example.com';
  let testConfirmation = 'QWERTYUIOP';
  this.set('email', testEmail);
  this.set('confirmation', testConfirmation);
  this.render(hbs`{{account-reset-password-form email=email confirmation=confirmation}}`);

  let requests = [];
  let url = `${ENV.wnycAuthAPI}/v1/confirm/password-reset`;
  this.server.post(url, (schema, request) => {
    requests.push(request);
    return {};
  }, 200);

  let testPassword = 'password123';
  this.$('label:contains(New Password) + input').val(testPassword);
  this.$('label:contains(New Password) + input').change();
  this.$('button:contains(Reset password)').click();

  return wait().then(() => {
    assert.equal(requests.length, 1);
    assert.deepEqual(JSON.parse(requests[0].requestBody), {email: testEmail, confirmation: testConfirmation, new_password: testPassword});
  });
});

test("it shows the 'oops' page when api returns an expired error", function(assert) {
  let testEmail = 'test@example.com';
  let testConfirmation = 'QWERTYUIOP';
  this.set('email', testEmail);
  this.set('confirmation', testConfirmation);
  this.render(hbs`{{account-reset-password-form email=email confirmation=confirmation}}`);

  let requests = [];
  let url = `${ENV.wnycAuthAPI}/v1/confirm/password-reset`;
  this.server.post(url, (schema, request) => {
    requests.push(request);
    return {
      "error": {
        "code": "ExpiredCodeException",
        "message": "Invalid code provided, please request a code again."
      }
    };
  }, 400);

  let testPassword = 'password123';
  this.$('label:contains(New Password) + input').val(testPassword);
  this.$('label:contains(New Password) + input').change();
  this.$('button:contains(Reset password)').click();

  return wait().then(() => {
    assert.equal(requests.length, 1, 'it should call the api reset url');
    assert.equal(this.$('.account-form-heading:contains(Oops!)').length, 1, 'the heading should say oops');
  });
});
