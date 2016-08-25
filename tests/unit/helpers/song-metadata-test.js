import { songMetadata } from 'overhaul/helpers/song-metadata';
import { module, test } from 'qunit';

module('Unit | Helper | song metadata');

// Replace this with your real tests.
test('it works', function(assert) {
  const catalogEntry = {
    title: "title",
    composer: {
      name: "composer"
    },
    soloists: [{
      musician: {
        name: "musician"
      },
      instruments: ["instrument"]
    }]
  };
  let result = songMetadata([catalogEntry]);
  const expected = 'title, composer, musician (instrument)';
  assert.strictEqual(result, expected, 'it should return correct song details');
});


test('it works with multiple musicians', function(assert) {
  const catalogEntry = {
    title: "title",
    composer: {
      name: "composer"
    },
    soloists: [{
      musician: {
        name: "musician 1"
      },
      instruments: ["vocals"]
    }, {
      musician: {
        name: "musician 2"
      },
      instruments: ["strings"]
    }, {
      : {
        name: "musician 3"
      },
      instruments: ["percussion"]
    }]
  };
  let result = songMetadata([catalogEntry]);
  const expected = 'title, composer, musician 1 (vocals), musician 2 (strings), musician 3 (percussion)';
  assert.strictEqual(result, expected, 'it should return correct song details');
});

test('it works with no musicians', function(assert) {
  const catalogEntry = {
    title: "title",
    composer: {
      name: "composer"
    },
    soloists: []
  };
  let result = songMetadata([catalogEntry]);
  const expected = 'title, composer';
  assert.strictEqual(result, expected, 'it should return correct song details');
});

test('it works with musicians with no instruments', function(assert) {
  const catalogEntry = {
    title: "title",
    composer: {
      name: "composer"
    },
    soloists: [{
      musician: {
        name: "musician"
      },
      instruments: []
    }]
  };
  let result = songMetadata([catalogEntry]);
  const expected = 'title, composer, musician';
  assert.strictEqual(result, expected, 'it should return correct song details');
});

test('it works with no composer', function(assert) {
  const catalogEntry = {
    title: "title",
    composer: null,
    soloists: [{
      musician: {
        name: "musician"
      },
      instruments: ["instrument"]
    }]
  };
  let result = songMetadata([catalogEntry]);
  const expected = 'title, musician (instrument)';
  assert.strictEqual(result, expected, 'it should return correct song details');
});

test('it works with no composer nor musicians', function(assert) {
  const catalogEntry = {
    title: "title",
    composer: null,
    soloists: []
  };
  let result = songMetadata([catalogEntry]);
  const expected = 'title';
  assert.strictEqual(result, expected, 'it should return correct song details');
});
