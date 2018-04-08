import { click, findAll, visit } from '@ember/test-helpers';
import config from 'wnyc-web-client/config/environment';
import BetaActionsMixin from 'wnyc-web-client/mixins/beta-actions';
import { plantBetaTrial, clearBetaCookies } from 'wnyc-web-client/tests/helpers/beta';
import { appendIfNot } from 'wnyc-web-client/tests/helpers/html';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import $ from 'jquery';

let assertRun;

BetaActionsMixin.reopen({
  actions: {
    exitBeta() {
      assertRun();
    },
    enterBeta() {
      assertRun();
    },
    dismissBeta() {
      assertRun();
    }
  }
});

module('Acceptance | active beta trial', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    plantBetaTrial();
    config.betaTrials.isBetaSite = false;
    config.betaTrials.preBeta = true;

    server.create('stream');
  });

  hooks.afterEach(function() {
    clearBetaCookies();
  });

  skip('when a trial is active, I can enter the beta', async function(assert) {
    assertRun = function() {
      assert.ok('enterBeta was called');
    };

    server.create('djangoPage', {id:'/'});

    await visit('/');

    findWithAssert('[data-test-selector=beta-enter]').click();
  });

  skip('when a trial is active, I can dismiss the beta invite', async function(assert) {
    assertRun = function() {
      assert.ok('dismissBeta was called');
    };

    //appendIfNot('beta-nav');
    server.create('djangoPage', {id:'/'});

    await visit('/');

    findWithAssert('[data-test-selector=beta-dismiss]').click();
  });

  skip('when a trial is active, display the invite message on all routes', async function(assert) {
    server.create('djangoPage', {id: '/'});
    server.create('djangoPage', {id: 'story/foo/'});

    await visit('/');

    assert.ok($('[data-test-selector=beta-tease]').length, 'beta trial tease is visible on home');

    await visit('/story/foo');

    assert.ok($('[data-test-selector=beta-tease]').length, 'beta trial tease is visible on a story');
  });
});

module('Acceptance | on the beta site', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    plantBetaTrial();
    config.betaTrials.isBetaSite = true;
    config.betaTrials.preBeta = false;
    server.create('stream');
  });

  skip('when I am on the beta site, I can exit the beta', async function(assert) {
    server.create('djangoPage', {id:'/'});
    assertRun = function() {
      assert.ok('exitBeta was called');
    };

    //appendIfNot('beta-nav');
    await visit('/');

    findWithAssert('[data-test-selector=beta-exit]').click();
  });


  // this dom node is rendered by a component that's only in beta
  skip('when I am on the beta site, I can see the beta nav menu', async function(assert) {
    server.create('djangoPage', {id:'/'});
    //appendIfNot('beta-nav');
    await visit('/');

    // #beta-nav is always added as a fallback for wormholing, so look for one
    // of the buttons instead
    assert.ok(findWithAssert('[data-test-selector=beta-open-about]'), 'about button should be visible');
    assert.equal(findAll('[data-test-selector=beta-open-about]').length, 1, 'only one should be appended');
  });
});

module('Acceptance | retired beta trial', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    const withExit = true;
    plantBetaTrial(withExit);
    config.betaTrials.isBetaSite = false;
    config.betaTrials.preBeta = false;
    server.create('stream');
  });

  skip('when a trial has been retired, I am shown the exit interview and can dismiss it', async function(assert) {
    server.create('djangoPage', {id:'/'});
    appendIfNot('site-chrome');
    await visit('/');

    assert.ok(findWithAssert('[data-test-selector=beta-exit]'), 'beta exit is visible');
    assert.equal(findAll('[data-test-selector=beta-exit]').length, 1, 'only one should be visible');

    await click('[data-test-selector=beta-exit-button]');

    assert.notOk(findAll('[data-test-selector=beta-exit]').length, 'beta exit is not visible');
  });
});
