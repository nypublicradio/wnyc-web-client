import { numericDuration } from 'overhaul/helpers/numeric-duration';
import { module, test } from 'qunit';

module('Unit | Helper | numeric duration');

// Replace this with your real tests.
test('it displays the correct time', function(assert) {
  let testCases = [{
    description: 'should display correct time for 0',
    inputMs: 0,
    expected: '0:00'
  },{    description: 'should display correct time for seconds < 10',
    inputMs: 5 * 1000,
    expected: '0:05'
  },{
    description: 'should display correct time for seconds > 10',
    inputMs: 15 * 1000,
    expected: '0:15'
  },{
    description: 'should display correct time for minutes < 10',
    inputMs: 5 * 60 * 1000,
    expected: '5:00'
  },{
    description: 'should display correct time for minutes > 10',
    inputMs: 15 * 60 * 1000,
    expected: '15:00'
  },{
    description: 'should display correct time for hours',
    inputMs: 2 * 60 * 60 * 1000,
    expected: '2:00:00'
  }];

  testCases.forEach(testCase => {
    let actual = numericDuration([testCase.inputMs]);
    const expected = testCase.expected;
    assert.strictEqual(actual, expected, testCase.description);
  });
});
