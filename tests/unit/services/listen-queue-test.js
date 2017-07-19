import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import startMirage from 'wqxr-web-client/tests/helpers/setup-mirage-for-integration';
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
      data: {},
      authorize: function() {}
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

  let [{slug:slug1}, {slug:slug2}] = server.createList('story', 2);

  Ember.run(() => {
    service.addToQueueById(slug1);
    service.addToQueueById(slug2);
  });

  return wait().then(() => assert.equal(service.get('items').length, 2));
});

test('addToQueueById returns a Promise that resolves to the added story', function(assert) {
  let service = this.subject();

  let {slug} = server.create('story', {title: 'foo story'});
  Ember.run(() => {
    service.addToQueueById(slug)
      .then(story => assert.equal(story.get('title'), 'foo story'));
  });
  return wait();
});

test('a story can be removed from the queue by id', function(assert) {
  let service = this.subject();

  let [ {slug:slug1}, {slug:slug2} ] = server.createList('story', 2);

  Ember.run(() => {
    service.addToQueueById(slug1);
    service.addToQueueById(slug2);
    service.removeFromQueueById(slug1);
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

  let [{slug:s1}, {slug:s2}, {slug:s3}, {slug:s4}, {slug:s5}] = server.createList('story', 5);

  Ember.run(() => {
    service.addToQueueById(s1);
    service.addToQueueById(s2);
    service.addToQueueById(s3);
    service.removeFromQueueById(s3);
    service.addToQueueById(s4);
    service.removeFromQueueById(s2);
    service.addToQueueById(s5);
    service.removeFromQueueById(s1);
    service.addToQueueById(s2);
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
    service.addToQueueById(story1.slug);
    service.addToQueueById(story2.slug);
    service.addToQueueById(story3.slug);
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
    service.addToQueueById(story1.slug);
  });

  return wait().then(() => {
    let nextUp = service.nextItem();
    // nextUp is an ember data record and we use slugs for IDs in ember 
    assert.equal(nextUp.id, story1.slug);
  });
});
