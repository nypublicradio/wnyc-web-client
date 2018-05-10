import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop'

module('Unit | Model | story metadata', function(hooks) {
  setupTest(hooks);

  const TEST_CASES =[{
    description: 'Basic onDemand Story',
    story: {
      title: 'Cool Story',
      url: 'http://wqxr.org/story/cool-story'
    },
    expectedMetadata: {
      shareText: "I'm listening to Cool Story",
      shareUrl: 'http://wqxr.org/story/cool-story',
      analyticsCode: '',
      via: 'WQXR'
    }
  },{
    description: 'onDemand Story with Show and analytics code',
    story: {
      title: 'Cool Story',
      headers: {brand: {title: 'Cool Show'}},
      url: 'http://wqxr.org/story/cool-story',
      analyticsCode: '123',
      via: 'WQXR'
    },
    expectedMetadata: {
      shareText: "I'm listening to Cool Show - Cool Story",
      shareUrl: 'http://wqxr.org/story/cool-story',
      analyticsCode: '123',
      via: 'WQXR'
    }
  }];

  TEST_CASES.forEach(testCase => {
    test(testCase.description, function(assert) {
      let story = run(() => this.owner.lookup('service:store').createRecord('story', testCase.story));
      let actual = run (() => story.get('shareMetadata'));
      const expected = testCase.expectedMetadata;
      assert.deepEqual(actual, expected, testCase.description);
    });
  });
});
