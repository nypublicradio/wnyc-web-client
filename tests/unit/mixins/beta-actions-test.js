import Ember from 'ember';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | beta actions');

// Replace this with your real tests.
test('it has the proper beta actions', function(assert) {
  let BetaActionsObject = Ember.Object.extend(BetaActionsMixin);
  let subject = BetaActionsObject.create();
  let expectedActions = ['enterBeta', 'dismissBeta', 'exitBeta'];
  let mixinActions = Object.keys(subject.actions);

  mixinActions.forEach(action => assert.ok(expectedActions.includes(action), `${action} is on mixin`));
});
