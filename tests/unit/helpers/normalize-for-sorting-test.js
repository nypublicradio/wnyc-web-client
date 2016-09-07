import { normalizeForSorting } from 'overhaul/helpers/normalize-for-sorting';
import { module, test } from 'qunit';

module('Unit | Helper | normalize for sorting');

// Replace this with your real tests.
test('it lowercases the string', function(assert) {
  let result = normalizeForSorting(['TiTlE']);
  const expected = 'title';
  assert.strictEqual(result, expected);
});

test('it trims whitespace', function(assert) {
  let result = normalizeForSorting(['  test title  ']);
  const expected = 'test title';
  assert.strictEqual(result, expected);
});

test('it removes articles', function(assert) {
  let result = normalizeForSorting(['The Test']);
  const expected = 'test';
  assert.strictEqual(result, expected);
});

test('it does not remove parts of words that match articles', function(assert) {
  let result = normalizeForSorting(['These Are Tests']);
  const expected = 'these are tests';
  assert.strictEqual(result, expected);
});

test('it does not remove articles in the middle of titles', function(assert) {
  let result = normalizeForSorting(['Concerts from the Library of Congress']);
  const expected = 'concerts from the library of congress';
  assert.strictEqual(result, expected);
});
