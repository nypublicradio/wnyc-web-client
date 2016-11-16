import { moduleFor, test } from 'ember-qunit';

moduleFor('service:data-pipeline', 'Unit | Service | data pipeline', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it reports the proper data for an item view', function(assert) {
  let browserId = 'foo';
  let testData = {cms_id: 1, item_type: 'story', site_id: 1};
  let expected = Object.assign({
    browser_id: browserId,
    client: 'wnyc_web',
    referer: null,
    url: location.toString()
  }, testData);
  
  let service = this.subject({
    session: {data: {browserId: 'foo'}},
    send(data) {
      assert.deepEqual(expected, data, 'passes in correct datay to send');
    }
  });
  
  service.reportItemView(testData);
});
