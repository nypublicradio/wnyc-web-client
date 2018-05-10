import EmberObject from '@ember/object';
import DeauthenticatedRouteMixinMixin from 'wqxr-web-client/mixins/deauthenticated-route-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | deauthenticated route mixin', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let DeauthenticatedRouteMixinObject = EmberObject.extend(DeauthenticatedRouteMixinMixin);
    let subject = DeauthenticatedRouteMixinObject.create();
    assert.ok(subject);
  });
});
