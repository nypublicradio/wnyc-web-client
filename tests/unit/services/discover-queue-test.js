import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import hifiNeeds from 'wnyc-web-client/tests/helpers/hifi-needs';

module('Unit | Service | discover-queue', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const sessionStub = Service.extend({
      data: {} // we only really need the data thing
    });

    this.owner.register('service:session', sessionStub);
    this.session = this.owner.lookup('service:session');
  });

  hooks.afterEach(function() {
  });

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:discover-queue');
    assert.ok(service);
  });

  test('item can get added to queue', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);

    assert.equal(service.get('items').length, 2);
  });

  test('item can get removed from discover queue', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);
    service.removeItem(story1);

    assert.equal(service.get('items').length, 1);
    assert.equal(service.get('items')[0].id, 2);
  });

  test('item can get removed from discover queue by id', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);
    service.removeItemById(1);

    assert.equal(service.get('items').length, 1);
    assert.equal(service.get('items')[0].id, 2);
  });

  test('queue can be updated in bulk', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);
    assert.equal(service.get('items').length, 2);

    service.updateQueue([{id:4}, {id:5}, {id:6}]);
    assert.equal(service.get('items').length, 3);
    assert.equal(service.get('items').map(d => d.id).join(","), "4,5,6");
  });

  test('queue can return next item that is unplayed', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let story3 = {id: 3};
    let story4 = {id: 4};

    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);
    service.addItem(story3);
    service.addItem(story4);

    service.get('history').addListen(story2);
    assert.equal(service.nextUnplayedItem().id, 1);
    service.get('history').addListen(story1);
    assert.equal(service.nextUnplayedItem().id, 3);
  });

  test('queue can return next item in list given the current item', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);
    assert.equal(service.get('items').length, 2);

    assert.equal(service.nextItem(1), story2);
  });

  test('queue can be empied', function(assert) {
    let story1 = {id: 1};
    let story2 = {id: 2};
    let service = this.owner.lookup('service:discover-queue');

    service.addItem(story1);
    service.addItem(story2);
    assert.equal(service.get('items').length, 2);

    service.emptyQueue();
    assert.equal(service.get('items').length, 0);
  });
});
