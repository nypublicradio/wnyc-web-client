import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'wnyc-web-client/tests/helpers/setup-mirage-for-integration';
import wait from 'ember-test-helpers/wait';

moduleFor('service:listen-queue', 'Unit | Service | listen queue', {
  needs: [
    'service:session',
    'model:story',
    'adapter:story',
    'serializer:story'
  ],
  beforeEach() {
    startMirage(this.container);
    const sessionStub = Ember.Service.extend({
      data: {}
    });

    this.register('service:session', sessionStub);
    this.inject.service('session', { as: 'session'  });
  },
  afterEach() {
    server.shutdown();
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('a story can be added to the queue by id', function(assert) {
  let service = this.subject();

  server.createList('story', 2);

  Ember.run(() => {
    service.addToQueueById(1);
    service.addToQueueById(2);
  });

  return wait().then(() => assert.equal(service.get('items').length, 2));
});

test('addToQueueById returns a Promise that resolves to the added story', function(assert) {
  let service = this.subject();

  server.create('story', {title: 'foo story'});
  Ember.run(() => {
    service.addToQueueById(1)
      .then(story => assert.equal(story.get('title'), 'foo story'));
  });
  return wait();
});

test('a story can be removed from the queue by id', function(assert) {
  let service = this.subject();

  let [ story1, story2 ] = server.createList('story', 2);

  Ember.run(() => {
    service.addToQueueById(story1.id);
    service.addToQueueById(story2.id);
    service.removeFromQueueById(story1.id);
  });

  return wait().then(() => assert.equal(service.get('items').length, 1));

});

test('a story already loaded can be removed from the queue by id', function(assert) {
  let service = this.subject();

  let session = service.get('session');
  session.set('data.queue', [ {id: 1} ]);

  service.removeFromQueueById(1);

  assert.equal(service.get('items').length, 0);
});

test('hyperactive adds and removes should still work', function(assert) {
  let service = this.subject();

  let [s1, s2, s3, s4, s5] = server.createList('story', 5);

  Ember.run(() => {
    service.addToQueueById(s1.id);
    service.addToQueueById(s2.id);
    service.addToQueueById(s3.id);
    service.removeFromQueueById(s3.id);
    service.addToQueueById(s4.id);
    service.removeFromQueueById(s2.id);
    service.addToQueueById(s5.id);
    service.removeFromQueueById(s1.id);
    service.addToQueueById(s2.id);
  });

  return wait().then(() => {
    let queue = service.get('items');
    assert.equal(queue.length, 3);
    // assert.equal(queue[0].id, s4.id)
    // assert.equal(queue[1].id, s5.id)
    // assert.equal(queue[2].id, s2.id)
  });
});

test('can replace the queue in one action', function(assert) {
  let service = this.subject();

  let [ story1, story2, story3 ] = server.createList('story', 3);
  let newOrder = [ story3, story2, story1 ];

  Ember.run(() => {
    service.addToQueueById(story1.id);
    service.addToQueueById(story2.id);
    service.addToQueueById(story3.id);
  });

  Ember.run(() => {
    service.reset(newOrder);
    assert.deepEqual(service.get('items'), newOrder);
  });
  return wait();
});

test('can retrieve the next item', function(assert) {
  let service = this.subject();

  let story1 = server.create('story');

  Ember.run(() => {
    service.addToQueueById(story1.id);
  });

  return wait().then(() => {
    let nextUp = service.nextItem();
    assert.equal(nextUp.id, story1.id);
  });
});
