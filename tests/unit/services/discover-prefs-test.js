import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('service:discover-prefs', 'Unit | Service | discover prefs', {
  // Specify the other units that are required for this test.
  needs: ['service:session'],

  beforeEach() {
    const sessionStub = Ember.Service.extend({
      data: {} // we only really need the data thing
    });

    this.register('service:session', sessionStub);
    this.inject.service('session', { as: 'session' });
  },
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it initializes topics and shows as empty on initialize', function(assert) {
  let service = this.subject();
  assert.deepEqual(service.get('selectedShowSlugs'), []);
  assert.deepEqual(service.get('selectedTopicTags'), []);
});

test('it saves to the session when asked to save', function(assert) {
  let service = this.subject();

  service.set('selectedShowSlugs', ['show-slug']);
  service.set('selectedTopicTags', ['topic-tag']);
  service.save();

  assert.deepEqual(service.get('session.data.discover-topics'), ['topic-tag']);
  assert.deepEqual(service.get('session.data.discover-shows'), ['show-slug']);
});

test('it loads data from the session on loadFromSession', function(assert) {
  let service = this.subject();

  service.set('session.data.discover-topics', ['topic-tag']);
  service.set('session.data.discover-shows', ['show-slug']);

  service.loadFromSession();

  assert.deepEqual(service.get('selectedShowSlugs'), ['show-slug']);
  assert.deepEqual(service.get('selectedTopicTags'), ['topic-tag']);
});
