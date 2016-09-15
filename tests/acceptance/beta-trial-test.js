import config from 'overhaul/config/environment';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';
import { plantBetaTrial, clearBetaCookies } from 'overhaul/tests/helpers/beta';
import { resetHTML, appendIfNot } from 'overhaul/tests/helpers/html';
import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
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

// pre-beta build only
moduleForAcceptance('Acceptance | active beta trial', {
  beforeEach() {
    plantBetaTrial();
    config.betaTrials.isBetaSite = false;
    config.betaTrials.preBeta = true;
    
    server.create('stream');
  },
  afterEach() {
    clearBetaCookies();
    resetHTML();
  }
});

test('when a trial is active, I can enter the beta', function(assert) {
  assertRun = function() {
    assert.ok('enterBeta was called');
  };

  server.create('djangoPage', {id:'/'});

  visit('/');

  andThen(() => {
    findWithAssert('[data-test-selector=beta-enter]').click();
  });
});

test('when a trial is active, I can dismiss the beta invite', function(assert) {
  assertRun = function() {
    assert.ok('dismissBeta was called');
  };

  //appendIfNot('beta-nav');
  server.create('djangoPage', {id:'/'});

  visit('/');

  andThen(() => {
    findWithAssert('[data-test-selector=beta-dismiss]').click();
  });
});

test('when a trial is active, display the invite message on all routes', function(assert) {
  server.create('djangoPage', {id: '/'});
  server.create('djangoPage', {id: 'story/foo/'});

  visit('/');

  andThen(function() {
    assert.ok($('[data-test-selector=beta-tease]').length, 'beta trial tease is visible on home');
  });

  visit('/story/foo');

  andThen(function() {
    assert.ok($('[data-test-selector=beta-tease]').length, 'beta trial tease is visible on a story');
  });
});

moduleForAcceptance('Acceptance | on the beta site', {
  beforeEach() {
    plantBetaTrial();
    config.betaTrials.isBetaSite = true;
    config.betaTrials.preBeta = false;
  },
  afterEach() {
    resetHTML();
  }
});

test('when I am on the beta site, I can exit the beta', function(assert) {
  server.create('djangoPage', {id:'/'});
  assertRun = function() {
    assert.ok('exitBeta was called');
  };

  //appendIfNot('beta-nav');
  visit('/');

  andThen(() => {
    findWithAssert('[data-test-selector=beta-exit]').click();
  });
});


// this dom node is rendered by a component that's only in beta
test('when I am on the beta site, I can see the beta nav menu', function(assert) {
  server.create('djangoPage', {id:'/'});
  //appendIfNot('beta-nav');
  visit('/');

  andThen(() => {
    // #beta-nav is always added as a fallback for wormholing, so look for one
    // of the buttons instead
    assert.ok(findWithAssert('[data-test-selector=beta-open-about]'), 'about button should be visible');
    assert.equal(find('[data-test-selector=beta-open-about]').length, 1, 'only one should be appended');
  });
});

moduleForAcceptance('Acceptance | retired beta trial', {
  beforeEach() {
    const withExit = true;
    plantBetaTrial(withExit);
    config.betaTrials.isBetaSite = false;
    config.betaTrials.preBeta = false;
  },
  afterEach() {
    resetHTML();
  }
});

test('when a trial has been retired, I am shown the exit interview and can dismiss it', function(assert) {
  server.create('djangoPage', {id:'/'});
  appendIfNot('site-chrome');
  visit('/');

  andThen(() => {
    assert.ok(findWithAssert('[data-test-selector=beta-exit]'), 'beta exit is visible');
    assert.equal(find('[data-test-selector=beta-exit]').length, 1, 'only one should be visible');
  });

  click('[data-test-selector=beta-exit-button]');

  andThen(() => {
    assert.notOk(find('[data-test-selector=beta-exit]').length, 'beta exit is not visible');
  });
});
