import { moduleForModel, test } from 'ember-qunit';
import startMirage from '../../../helpers/setup-mirage-for-integration';

moduleForModel('discover/topics', 'Unit | Serializer | discover/topics', {
  // Specify the other units that are required for this test.
  needs: ['serializer:discover/topics', 'adapter:discover/topics', 'model:discover/topics'],
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    server.shutdown();
  }
});

test('it serializes the data', function(assert) {
  let done = assert.async();
  server.createList('discover-topic', 25);
  this.store().query('discover/topics', {}).then(records => {
    let keysToCheck = ['title', 'url'];
    assert.equal(records.get('length'), 25);
    let record = records.get('firstObject');
    keysToCheck.forEach(function(key) {
      var value = record.get(key);
      assert.ok(!!value, `${key} exists in topic serialization`);
    });
    done();
  });
});
