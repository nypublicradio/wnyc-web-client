import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { startMirage }  from 'wnyc-web-client/initializers/ember-cli-mirage';
import wait from 'ember-test-helpers/wait';



moduleForComponent('resend-link', 'Integration | Component | resend link', {
  integration: true,
  beforeEach() {
    this.server = startMirage();
  },
  afterEach() {
    this.server.shutdown();
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{resend-link}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#resend-link}}
      template block text
    {{/resend-link}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('it sends the given email address to the given endpoint when clicked', function(assert) {
  let fakeEndpoint = 'http://example.com/resender';
  let fakeEmail = 'test@example.com';

  this.set('target', fakeEndpoint);
  this.set('email', fakeEmail);

  this.render(hbs`
    {{#resend-link target=target email=email autoReset=false}}
      Resend Email.
    {{/resend-link}}
  `);

  let endpoint = {hits: []};
  this.server.get(fakeEndpoint, (schema, request) => {
    endpoint.hits.push(request.queryParams);
    return {};
  }, 200);

  this.$('a').click();

  return wait().then(() => {
    assert.equal(endpoint.hits.length, 1);
    assert.deepEqual(endpoint.hits[0], {email: fakeEmail});
  });
});

test('it changes to the sent message when clicked', function(assert) {
  let fakeEndpoint = 'http://example.com/resender';
  let fakeEmail = 'test@example.com';
  let successMessage = 'Email Sent';

  this.set('target', fakeEndpoint);
  this.set('email', fakeEmail);
  this.set('successMessage', successMessage);

  this.render(hbs`
    {{#resend-link target=target email=email successMessage=successMessage autoReset=false }}
      Resend Email.
    {{/resend-link}}
  `);

  this.server.get(fakeEndpoint, {}, 200);

  this.$('a').click();

  return wait().then(() => {
    assert.equal(this.$().text().trim(), successMessage);
  });
});

test('it changes to the error message when clicked and endpoint returns an error', function(assert) {
  let fakeEndpoint = 'http://example.com/resender';
  let fakeEmail = 'test@example.com';
  let errorMessage = 'Email Not Sent';

  this.set('target', fakeEndpoint);
  this.set('email', fakeEmail);
  this.set('errorMessage', errorMessage);

  this.render(hbs`
    {{#resend-link target=target email=email errorMessage=errorMessage autoReset=false}}
      Resend Email.
    {{/resend-link}}
  `);

  this.server.get(fakeEndpoint, {}, 400);

  this.$('a').click();

  return wait().then(() => {
    assert.equal(this.$().text().trim(), errorMessage);
  });
});

test('it resets to the original message', function(assert) {
  let fakeEndpoint = 'http://example.com/resender';
  let fakeEmail = 'test@example.com';
  let errorMessage = 'Email Not Sent';

  this.set('target', fakeEndpoint);
  this.set('email', fakeEmail);
  this.set('errorMessage', errorMessage);
  this.set('resetDelay', 0);

  this.render(hbs`
    {{#resend-link target=target email=email errorMessage=errorMessage resetDelay=resetDelay}}
      Resend Email.
    {{/resend-link}}
  `);

  this.server.get(fakeEndpoint, {}, 200);

  this.$('a').click();

  return wait().then(() => {
    assert.equal(this.$().text().trim(), 'Resend Email.');
  });
});
