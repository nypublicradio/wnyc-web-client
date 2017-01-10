import { canChangeVolume } from 'wnyc-web-client/helpers/can-change-volume';
import { module, test } from 'qunit';

module('Unit | Helper | can change volume');

// Replace this with your real tests.
test('it returns true when we can change the volume of an audio element', function(assert) {
  const originalCreateElement = document.createElement;
  document.createElement = () => {
      return { volume: 1 };
  };
  const couldChangeVolume = canChangeVolume();
  document.createElement = originalCreateElement;
  assert.strictEqual(couldChangeVolume, true);
});

test("it returns false when we can't change the volume of an audio element", function(assert) {
  const originalCreateElement = document.createElement;
  document.createElement = () => {
    return {
      get volume() {return 1;},
      set volume(v) { this.notVolume = v;}
    };
  };
  const couldChangeVolume = canChangeVolume();
  document.createElement = originalCreateElement;
  assert.strictEqual(couldChangeVolume, false);
});

test("it returns false when we don't have volume", function(assert) {
  const originalCreateElement = document.createElement;
  document.createElement = () => {
    return {};
  };
  const couldChangeVolume = canChangeVolume();
  document.createElement = originalCreateElement;
  assert.strictEqual(couldChangeVolume, false);
});
