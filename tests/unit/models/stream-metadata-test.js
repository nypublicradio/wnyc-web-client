import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | stream metadata', function(hooks) {
  setupTest(hooks);

  const TEST_CASES =[{
    description: 'Stream Show',
    story: {
      audioType: 'livestream',
      currentShow: {
        title: 'Cool Show',
        url: 'http://wqxr.org/shows/cool-show'
      }
    },
    expectedMetadata: {
      shareText: "I'm listening to Cool Show",
      shareUrl: 'http://wqxr.org/shows/cool-show',
      analyticsCode: '',
      via: 'WQXR'
    }
  },{
    description: 'Stream Song',
    story: {
      audioType: 'livestream',
      slug: 'test',
      currentPlaylistItem: {catalogEntry: {
        title: 'Masterpiece',
        composer: {name: 'Maestro'}
      }},
    },
    expectedMetadata: {
      shareText: 'I\'m listening to Maestro - Masterpiece',
      shareUrl: 'http://www.wqxr.org/streams/?stream=test',
      analyticsCode: '',
      via: 'WQXR'
    }
  }];

  TEST_CASES.forEach(testCase => {
    test(testCase.description, function(assert) {
      let stream = this.subject(testCase.story);
      let actual = stream.get('shareMetadata');
      const expected = testCase.expectedMetadata;
      assert.deepEqual(actual, expected, testCase.description);
    });
  });
});
