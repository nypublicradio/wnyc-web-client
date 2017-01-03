import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ENV from 'overhaul/config/environment';
import sinon from 'sinon';

moduleForComponent('account-reset-password-form', 'Integration | Component | account reset password form', {
  integration: true,
  beforeEach() {
    this.requests = [];
    this.xhr = sinon.useFakeXMLHttpRequest();
    this.xhr.onCreate = $.proxy(function(xhr) {
        this.requests.push(xhr);
    }, this);
  },
  afterEach() {
    this.xhr.restore();
  }
});

test('it renders', function(assert) {
  this.render(hbs`{{account-reset-password-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});

test('submitting the form sends the correct values to the correct endpoint', function(assert) {
  let testEmail = 'test@example.com';
  let testCode = 'QWERTYUIOP';
  this.set('email', testEmail);
  this.set('code', testCode);
  this.render(hbs`{{account-reset-password-form email=email code=code}}`);

  let testPassword = 'password123';
  this.$('label:contains(New Password) + input').val(testPassword);
  this.$('label:contains(New Password) + input').change();
  this.$('button:contains(Reset password)').click();

  const request = this.requests[0];

  const expectedUrl = `${ENV.wnycAuthAPI}/v1/confirm/password-reset`;
  const expectedMethod = 'POST';

  assert.equal(expectedUrl, request.url);
  assert.equal(expectedMethod, request.method);

  let requestBody = JSON.parse(request.requestBody);
  assert.equal(testEmail, requestBody.email);
  assert.equal(testPassword, requestBody.new_password);
  assert.equal(testCode, requestBody.confirmation);
});
