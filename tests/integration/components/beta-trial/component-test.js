import $ from 'jquery';
import { generateBetaTrial } from 'wqxr-web-client/tests/helpers/beta';
import { moduleForComponent, test } from 'ember-qunit';
import { resetHTML, appendIfNot } from 'wqxr-web-client/tests/helpers/html';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('beta-trial', 'Integration | Component | beta trial', {
  integration: true,
  beforeEach() {
    appendIfNot('modal-wormhole-testing');
    appendIfNot('beta-wormhole-testing');
  },
  afterEach() {
    resetHTML();
  }
});

test('it renders into wormholes', function(assert) {
  let beta = generateBetaTrial();
  beta.set('preBeta', true);
  this.set('beta', beta);

  this.render(hbs`<div id="foo"></div>`);
  this.render(hbs`<div id="bar"></div>`);
  this.render(hbs`{{beta-trial beta=beta betaInvite='bar' legacyNavLink='foo'}}`);

  assert.equal($('#bar [data-test-selector=beta-tease]').text().trim(), beta.tease);
  assert.equal($('#foo').text().trim().toLowerCase(), "switch to wnyc beta");
});

test('if this is a preBeta app, it adds landing sites to the alien DOM', function(assert) {
  let beta = generateBetaTrial();
  beta.set('preBeta', true);
  this.set('beta', beta);

  this.render(hbs`{{beta-trial beta=beta betaInvite='bar' legacyNavLink='foo'}}`);
  assert.ok($('#foo').length, 'adds a legacyNavLink landing site');
  assert.ok($('#bar').length, 'adds a beta invite landing site');
});

test('beta invite can be dismissed', function(assert) {
  assert.expect(4);

  let beta = generateBetaTrial();
  beta.set('preBeta', true);
  this.set('beta', beta);

  this.set('externalAction', () => {
    assert.ok('external action was fired');
  });

  this.render(hbs`{{beta-trial beta=beta onDismiss=(action externalAction)}}`);

  assert.ok($('[data-test-selector=beta-tease]').length, 'beta message is visible');
  assert.ok($('[data-test-selector=beta-dismiss]').length, 'dismiss button is visible');
  $('[data-test-selector=beta-dismiss]').click();
  assert.notOk($('[data-test-selector=beta-tease]').length, 'beta message is hidden');
});

test('beta invite can be entered', function(assert) {
  assert.expect(2);

  let beta = generateBetaTrial();
  beta.set('preBeta', true);
  this.set('beta', beta);

  this.set('externalAction', () => {
    assert.ok('external action was fired');
  });

  this.render(hbs`{{beta-trial beta=beta enterBeta=(action externalAction)}}`);

  assert.ok($('[data-test-selector=beta-enter]').length, 'beta entrance button is visible');
  $('[data-test-selector=beta-enter]').click();
});

// moduleForComponent('beta-trial', 'Integration | Component | beta trial | on beta state', {
//   integration: true,
//   afterEach() {
//     resetHTML();
//     appendIfNot('beta-wormhole-testing');
//   }
// });

test('if this is not a preBeta app, it will not add landing sites to the alien DOM', function(assert) {
  let beta = generateBetaTrial();
  this.set('beta', beta);

  this.render(hbs`{{beta-trial beta=beta betaInvite='bar' legacyNavLink='foo'}}`);

  assert.notOk($('#foo').length, 'does not add a legacyNavLink landing site');
  assert.notOk($('#bar').length, 'does not add a beta invite landing site');
});

test('it can render an about dialog', function(assert) {
  let beta = generateBetaTrial();
  beta.isBetaSite = true;

  this.set('beta', beta);
  this.render(hbs`{{beta-trial beta=beta modalTarget='modal-wormhole-testing' betaNav='beta-wormhole-testing'}}`);

  assert.notOk($('[data-test-selector=beta-modal').length, 'modal is hidden');
  $('[data-test-selector=beta-open-about]').click();

  assert.ok($('[data-test-selector=beta-modal').length, 'modal appears');
  assert.ok($('[data-test-selector=beta-about').length, 'about description appears');
  assert.equal($('[data-test-selector=beta-about').text().trim(), beta.welcome_message, 'about description appears');
});

test('it can close the about dialog', function(assert) {
  let beta = generateBetaTrial();
  beta.isBetaSite = true;

  this.set('beta', beta);
  this.render(hbs`{{beta-trial beta=beta showModal=true modalTarget='modal-wormhole-testing' betaNav='beta-wormhole-testing'}}`);

  assert.ok($('[data-test-selector=beta-modal').length, 'modal appears');
  $('[data-test-selector=beta-modal-close]').click();
  assert.notOk($('[data-test-selector=beta-modal').length, 'modal is gone');
});

test('it can close the about dialoag by clicking outside the modal', function(assert) {
  let beta = generateBetaTrial();
  beta.isBetaSite = true;

  this.set('beta', beta);
  this.render(hbs`{{beta-trial beta=beta showModal=true modalTarget='modal-wormhole-testing' betaNav='beta-wormhole-testing'}}`);

  assert.ok($('[data-test-selector=beta-modal').length, 'modal appears');
  $('[data-test-selector=beta-modal]').click();
  assert.notOk($('[data-test-selector=beta-modal').length, 'modal is gone');
});

test('it can exit the beta', function(assert) {
  assert.expect(2);
  let beta = generateBetaTrial();
  beta.isBetaSite = true;
  this.set('externalAction', () => {
    assert.ok('external action was fired');
  });
  this.set('beta', beta);

  this.render(hbs`{{beta-trial betaNav='beta-wormhole-testing' beta=beta exitBeta=(action externalAction)}}`);
  assert.ok($('[data-test-selector=beta-exit]').length, 'beta exit button is visible');
  $('[data-test-selector=beta-exit]').click();

});

// moduleForComponent('beta-trial', 'Integration | Component | beta trial | retired beta state', {
//   integration: true,
//   afterEach() {
//     resetHTML();
//     appendIfNot('beta-wormhole-testing');
//   }
// });

test('it renders an exit interview', function(assert) {
  const withExit = true;
  let beta = generateBetaTrial(withExit);
  this.set('beta', beta);

  this.render(hbs`{{beta-trial beta=beta modalTarget='ember-testing'}}`);

  assert.ok($('[data-test-selector=beta-modal]').length, 'modal appears');
  assert.equal($('[data-test-selector=beta-exit]').text().trim(), beta.exit_message, 'exit description appears');
});
