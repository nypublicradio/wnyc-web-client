import EmberObject from '@ember/object';
import BetaActionsMixin from 'wnyc-web-client/mixins/beta-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | beta actions', function() {
  // Replace this with your real tests.
  test('it has the proper beta actions', function(assert) {
    let BetaActionsObject = EmberObject.extend(BetaActionsMixin);
    let subject = BetaActionsObject.create();
    let expectedActions = ['enterBeta', 'dismissBeta', 'exitBeta'];
    let mixinActions = Object.keys(subject.actions);

    mixinActions.forEach(action => assert.ok(expectedActions.includes(action), `${action} is on mixin`));
  });
});
