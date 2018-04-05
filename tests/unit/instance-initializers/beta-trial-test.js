import $ from 'jquery';
import Application from '@ember/application';
import { run } from '@ember/runloop';
import config from 'wnyc-web-client/config/environment';
import { initialize } from 'wnyc-web-client/instance-initializers/beta-trial';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import { plantBetaTrial } from 'wnyc-web-client/tests/helpers/beta';

module('Unit | Instance Initializer | beta trial | active trial', function(hooks) {
  hooks.beforeEach(function() {
    plantBetaTrial();
    run(() => {
      this.application = Application.create();
      this.appInstance = this.application.buildInstance();
    });
  });

  hooks.afterEach(function() {
    run(this.appInstance, 'destroy');
    destroyApp(this.application);
    $('#ember-testing').empty();
  });

  test('the beta object is injected into the app', function(assert) {
    initialize(this.appInstance);
    let beta = this.appInstance.lookup('beta:main');

    assert.ok(beta, 'beta is initialized');
  });
});

module('Unit | Instance Initializer | beta trial | no trial', function(hooks) {
  hooks.beforeEach(function() {
    run(() => {
      this.application = Application.create();
      this.appInstance = this.application.buildInstance();
    });
    config.betaTrials.active = false;
  });

  hooks.afterEach(function() {
    run(this.appInstance, 'destroy');
    destroyApp(this.application);
  });

  test('turning off the feature flag keeps the beta object out of the app', function(assert) {
    initialize(this.appInstance);
    let beta = this.appInstance.lookup('beta:main');

    assert.notOk(beta, 'beta is not initialized');
  });
});
