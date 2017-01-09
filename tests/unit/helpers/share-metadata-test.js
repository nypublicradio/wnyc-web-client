import { shareMetadata } from 'wqxr-web-client/helpers/share-metadata';
import { module, test } from 'qunit';

module('Unit | Helper | share metadata');

test('it produces the correct metadata for stories', function(assert) {
  let testCases =[{
    description: 'Basic onDemand Story',
    story: {
      title: 'Cool Story',
      url: 'http://wync.org/story/cool-story'
    },
    expectedMetadata: {
      shareText: 'Cool Story',
      shareUrl: 'http://wync.org/story/cool-story',
      analyticsCode: ''
    }
  },{
    description: 'onDemand Story with Show and analytics code',
    story: {
      title: 'Cool Story',
      headers: {brand: {title: 'Cool Show'}},
      url: 'http://wync.org/story/cool-story',
      analyticsCode: '123'
    },
    expectedMetadata: {
      shareText: 'Cool Show - Cool Story',
      shareUrl: 'http://wync.org/story/cool-story',
      analyticsCode: '123'
    }
  },{
    description: 'Stream Show',
    story: {
      audioType: 'stream',
      currentShow: {
        title: 'Cool Show',
        url: 'http://wync.org/shows/cool-show'
      }
    },
    expectedMetadata: {
      shareText: 'Cool Show',
      shareUrl: 'http://wync.org/shows/cool-show',
      analyticsCode: ''
    }
  },{
    description: 'Stream Song',
    story: {
      audioType: 'stream',
      slug: 'test',
      currentPlaylistItem: {catalogEntry: {
        title: 'Masterpiece',
        composer: {name: 'Maestro'}
      }},
    },
    expectedMetadata: {
      shareText: 'Masterpiece - Maestro',
      shareUrl: 'http://www.wnyc.org/streams/test',
      analyticsCode: ''
    }
  },{
    description: 'Null Story',
    story: null,
    expectedMetadata: {
      shareText: '',
      shareUrl: '',
      analyticsCode: ''
    }
  }];

  testCases.forEach(testCase => {
    let actual = shareMetadata(testCase.story);
    const expected = testCase.expectedMetadata;
    assert.deepEqual(actual, expected, testCase.description);
  });
});
