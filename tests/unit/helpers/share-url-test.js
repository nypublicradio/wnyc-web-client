import { shareUrl } from 'wnyc-web-client/helpers/share-url';
import { module, test } from 'qunit';

module('Unit | Helper | share url');

// Replace this with your real tests.
test('it generates the correct share urls', function(assert) {
  let metadata = {shareText: 'Cool Story', shareUrl: 'http://wnyc.org'};
  let testCases = [{
    description: 'facebook',
    service: 'Facebook',
    metadata,
    expectedResult: 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwnyc.org'
  },{
    description: 'twitter',
    service: 'Twitter',
    metadata,
    expectedResult: 'https://twitter.com/intent/tweet?url=http%3A%2F%2Fwnyc.org&text=Cool%20Story&via=WNYC'
  },{
    description: 'email',
    service: 'Email',
    metadata,
    expectedResult: 'mailto:?subject=Cool%20Story&body=http%3A%2F%2Fwnyc.org'
  },{
    description: 'Null',
    service: null,
    input: null,
    expectedResult: ''
  },];

  testCases.forEach(testCase => {
    let actual = shareUrl([testCase.service, testCase.metadata]);
    const expected = testCase.expectedResult;
    assert.deepEqual(actual, expected, testCase.description);
  });
});
