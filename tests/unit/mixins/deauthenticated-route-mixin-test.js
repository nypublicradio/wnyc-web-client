import Ember from 'ember';
import DeauthenticatedRouteMixinMixin from 'wnyc-web-client/mixins/deauthenticated-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | deauthenticated route mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let DeauthenticatedRouteMixinObject = Ember.Object.extend(DeauthenticatedRouteMixinMixin);
  let subject = DeauthenticatedRouteMixinObject.create();
  assert.ok(subject);
});
