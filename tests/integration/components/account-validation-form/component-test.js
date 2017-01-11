import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import ENV from 'wnyc-web-client/config/environment';
import wait from 'ember-test-helpers/wait';
import sinon from 'sinon';

moduleForComponent('account-validator', 'Integration | Component | account validation form', {
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
  this.render(hbs`{{account-validation-form}}`);
  assert.equal(this.$('.account-form').length, 1);
});

test('it sends the correct values to the endpoint to verify the account', function(assert) {
  const testUser = 'UserName';
  const testConfirmation = 'QWERTYUIOP';
  this.set('username', testUser);
  this.set('confirmation', testConfirmation);

  this.render(hbs`{{account-validation-form username=username confirmation=confirmation}}`);

  const request = this.requests[0];

  const expectedUrl = `${ENV.wnycAuthAPI}/v1/confirm/sign-up?confirmation=${testConfirmation}&username=${testUser}`;
  const expectedMethod = 'GET';

  assert.equal(expectedUrl, request.url);
  assert.equal(expectedMethod, request.method);
});

test('it shows the login form and success alert when verification succeeds', function(assert) {
  const testUser = 'UserName';
  const testConfirmation = 'QWERTYUIOP';
  const validateNewAccount = sinon.stub().returns(Promise.resolve());

  this.set('username', testUser);
  this.set('confirmation', testConfirmation);
  this.set('validateNewAccount', validateNewAccount);

  this.render(hbs`{{account-validation-form username=username confirmation=confirmation validateNewAccount=validateNewAccount}}`);

  return wait().then(() => {
    assert.deepEqual(validateNewAccount.called), true, 'it calls validate');
    assert.equal(this.$('.account-form').length, 1, 'it should show an account form');
    assert.equal(this.$('button:contains(Log in)').length, 1, 'it should show a login button');
    assert.equal(this.$('.alert-success:contains(Your email has been verified and your online account is now active.)').length, 1, 'it should show a success alert');
  });
});
