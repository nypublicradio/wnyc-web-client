import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | discover prefs', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const sessionStub = Service.extend({
      init() {
        this._super(...arguments);
        this.set('data', {});
      },
    });

    this.owner.register('service:session', sessionStub);
    this.session = this.owner.lookup('service:session');
  });

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let service = this.owner.lookup('service:discover-prefs');
    assert.ok(service);
  });

  test('it initializes topics and shows as empty on initialize', function(assert) {
    let service = this.owner.lookup('service:discover-prefs');
    assert.deepEqual(service.get('excludedShowSlugs'), []);
    assert.deepEqual(service.get('selectedTopicTags'), []);
  });

  test('it saves to the session when asked to save', function(assert) {
    let service = this.owner.lookup('service:discover-prefs');

    service.set('excludedShowSlugs', ['show-slug']);
    service.set('selectedTopicTags', ['topic-tag']);
    service.save();

    assert.deepEqual(service.get('session.data.discover-topics'), ['topic-tag']);
    assert.deepEqual(service.get('session.data.discover-excluded-shows'), ['show-slug']);
  });

  test('it loads data from the session on loadFromSession', function(assert) {
    let service = this.owner.lookup('service:discover-prefs');

    service.set('session.data.discover-topics', ['topic-tag']);
    service.set('session.data.discover-excluded-shows', ['show-slug']);

    service.loadFromSession();

    assert.deepEqual(service.get('excludedShowSlugs'), ['show-slug']);
    assert.deepEqual(service.get('selectedTopicTags'), ['topic-tag']);
  });

  test('it can keep track of excluded story ids', function(assert) {
    let service = this.owner.lookup('service:discover-prefs');

    service.set('excludedStoryIds', [1]);
    service.save();

    assert.deepEqual(service.get('session.data.discover-excluded-story-ids'), [1]);

    service.excludeStoryId(3);
    service.excludeStoryId(4);

    assert.deepEqual(service.get('excludedStoryIds'), [1,3,4], "should have new excluded ids in memory");
    assert.deepEqual(service.get('session.data.discover-excluded-story-ids'), [1,3,4], "should be saved in session immediately");
    service.save();
    assert.deepEqual(service.get('session.data.discover-excluded-story-ids'), [1,3,4], "should have saved in session");
  });
});
