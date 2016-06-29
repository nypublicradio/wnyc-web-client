import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:listenaction', 'Unit | Adapter | listenaction', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('it tells $.ajax to send cookies', function(assert) {
  let adapter = this.subject();
  let options = adapter.ajaxOptions('/foo', 'POST', {});
  assert.ok(options.xhrFields.withCredentials, 'withCredentials is true');
});
