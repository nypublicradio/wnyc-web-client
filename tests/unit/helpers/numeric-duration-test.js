import { numericDuration } from 'wnyc-web-client/helpers/numeric-duration';
import { module, test } from 'qunit';

module('Unit | Helper | numeric duration');

// Replace this with your real tests.
test('it displays the correct time', function(assert) {
  let testCases = [{
    description: 'should display correct time for 0',
    inputMs: 0,
    expected: '0:00'
  },{    description: 'should display correct time for seconds < 10',
    inputMs: 1 * 1000,
    expected: '0:01'
  },{
    description: 'should display correct time for seconds > 10',
    inputMs: 10 * 1000,
    expected: '0:10'
  },{
    description: 'should display correct time for minutes < 10',
    inputMs: 1 * 60 * 1000,
    expected: '1:00'
  },{
    description: 'should display correct time for minutes > 10',
    inputMs: 10 * 60 * 1000,
    expected: '10:00'
  },{
    description: 'should display correct time for hours',
    inputMs: 1 * 60 * 60 * 1000,
    expected: '1:00:00'
  }];

  testCases.forEach(testCase => {
    let actual = numericDuration([testCase.inputMs]);
    const expected = testCase.expected;
    assert.strictEqual(actual, expected, testCase.description);
  });
});
