import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Serializer | discover/topics', function(hooks) {
  setupTest(hooks);

  test('it serializes the data', function(assert) {
    let done = assert.async();
    server.createList('discover-topic', 25);
    this.owner.lookup('service:store').query('discover/topics', {}).then(records => {
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
});
