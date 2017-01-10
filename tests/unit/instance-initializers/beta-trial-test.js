import Ember from 'ember';
import config from 'wnyc-web-client/config/environment';
import { initialize } from 'wnyc-web-client/instance-initializers/beta-trial';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import { resetHTML } from 'wnyc-web-client/tests/helpers/html';
import { plantBetaTrial } from 'wnyc-web-client/tests/helpers/beta';

module('Unit | Instance Initializer | beta trial | active trial', {
  beforeEach: function() {
    plantBetaTrial();
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
    resetHTML();
  }
});

test('the beta object is injected into the app', function(assert) {
  initialize(this.appInstance);
  let beta = this.appInstance.lookup('beta:main');

  assert.ok(beta, 'beta is initialized');
});

module('Unit | Instance Initializer | beta trial | no trial', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
    config.betaTrials.active = false;
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
    resetHTML();
  }
});

test('turning off the feature flag keeps the beta object out of the app', function(assert) {
  initialize(this.appInstance);
  let beta = this.appInstance.lookup('beta:main');

  assert.notOk(beta, 'beta is not initialized');
});
