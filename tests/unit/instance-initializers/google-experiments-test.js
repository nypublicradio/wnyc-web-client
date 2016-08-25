import Ember from 'ember';
import { initialize } from 'overhaul/instance-initializers/google-experiments';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import config from 'overhaul/config/environment';

module('Unit | Instance Initializer | google experiments', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it registers an A/B test variation at config.experimentalGroup', function(assert) {
  window.cxApi = { chooseVariation: () => 'foo' };
  initialize(this.appInstance);

  assert.equal(config.experimentalGroup, 'foo', 'it injects the experimental group into the config');
});

test('it runs ok in the absence of the google experiment script', function(assert) {
  delete window.cxApi;
  initialize(this.appInstance);
  assert.ok(true, 'it ran without error');
});
