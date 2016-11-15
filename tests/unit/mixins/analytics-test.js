import Ember from 'ember';
import AnalyticsMixin from 'overhaul/mixins/analytics';
import { module, test } from 'qunit';

module('Unit | Mixin | analytics');

// Replace this with your real tests.
test('it works', function(assert) {
  let AnalyticsObject = Ember.Object.extend(AnalyticsMixin);
  let subject = AnalyticsObject.create();
  assert.ok(subject);
});

test('willTransition saves previous url', function(assert) {
  let AnalyticsObject = Ember.Object.extend(AnalyticsMixin);
  let subject = AnalyticsObject.create();
  subject.willTransition();
  assert.equal(subject.get('_referrer'), location.toString(), '_referrer should current url');
});
