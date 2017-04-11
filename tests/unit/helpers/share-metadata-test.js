import { shareMetadata } from 'wqxr-web-client/helpers/share-metadata';
import { module, test } from 'qunit';

module('Unit | Helper | share metadata');

test('it produces the correct metadata for stories', function(assert) {
  let testCases =[{
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
  },{
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
      shareUrl: 'http://www.wqxr.org/streams/test',
      analyticsCode: '',
      via: 'WQXR'
    }
  },{
    description: 'Null Story',
    story: null,
    expectedMetadata: {
      shareText: '',
      shareUrl: '',
      analyticsCode: '',
      via: ''
    }
  }];

  testCases.forEach(testCase => {
    let actual = shareMetadata(testCase.story);
    const expected = testCase.expectedMetadata;
    assert.deepEqual(actual, expected, testCase.description);
  });
});
