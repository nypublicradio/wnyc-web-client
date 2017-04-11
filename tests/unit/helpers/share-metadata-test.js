import { shareMetadata } from 'wnyc-web-client/helpers/share-metadata';
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
      analyticsCode: '',
      via: 'WNYC'
    }
  },{
    description: 'onDemand Story with Show and analytics code',
    story: {
      title: 'Cool Story',
      headers: {brand: {title: 'Cool Show'}},
      url: 'http://wync.org/story/cool-story',
      analyticsCode: '123',
      via: 'WNYC'
    },
    expectedMetadata: {
      shareText: 'Cool Show - Cool Story',
      shareUrl: 'http://wync.org/story/cool-story',
      analyticsCode: '123',
      via: 'WNYC'
    }
  },{
    description: 'Stream Show',
    story: {
      audioType: 'livestream',
      currentShow: {
        title: 'Cool Show',
        url: 'http://wync.org/shows/cool-show'
      }
    },
    expectedMetadata: {
      shareText: 'Cool Show',
      shareUrl: 'http://wync.org/shows/cool-show',
      analyticsCode: '',
      via: 'WNYC'
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
      shareText: 'Masterpiece - Maestro',
      shareUrl: 'http://www.wnyc.org/streams/test',
      analyticsCode: '',
      via: 'WNYC'
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
