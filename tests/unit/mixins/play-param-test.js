import Ember from 'ember';
import PlayParamMixin from 'overhaul/mixins/play-param';
import { module, test } from 'qunit';

module('Unit | Mixin | play param');

// Replace this with your real tests.
test('it works', function(assert) {
  let PlayParamObject = Ember.Object.extend(PlayParamMixin);
  let subject = PlayParamObject.create();
  assert.ok(subject);
});

test('didTransition action checks for play param and calls play on service', function(assert) {
  let PlayParamObject = Ember.Route.extend(PlayParamMixin);
  
  let slug = 'wnyc-fm939';
  let applicationController = Ember.Object.create({play: slug});
  let subject = PlayParamObject.create({
    audio: {
      play(param) {
        assert.equal(param, slug, 'play was called with correct slug');
      }
    },
    controllerFor() {
      return applicationController;
    }
  });
  
  subject.send('didTransition');
});

test('willTransition action clears the play param on the application controller', function(assert) {
  let PlayParamObject = Ember.Route.extend(PlayParamMixin);
  
  let applicationController = Ember.Object.create({play: 'foo'});
  let subject = PlayParamObject.create({
    audio: {
      play(param) {
        assert.equal(param, slug, 'play was called with correct slug');
      }
    },
    controllerFor() {
      return applicationController;
    }
  });
  subject.send('willTransition');
  
  assert.equal(applicationController.get('play'), null, 'play attr should be null');
});
