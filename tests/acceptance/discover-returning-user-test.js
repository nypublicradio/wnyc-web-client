import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import { currentSession } from 'overhaul/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | discover returning user', {
  beforeEach() {
    let session = currentSession(this.application);
    server.create('discover-topic', {title: "Music", url: "music"});
    server.create('discover-topic', {title: "Art", url: "art"});
    server.create('discover-topic', {title: "Technology", url: "technology"});
    session.set('data.discover-topics', ['music']); // set some saved topics
  }
});

test('visiting discover/edit starts you on topics', function(assert) {
  visit('/discover/edit');
  andThen(function() {
    assert.equal(currentURL(), '/discover/edit/topics');
  });
});

test('topics are saved in a session and maintained upon next visit in edit flow', function(assert) {
  visit('/discover/edit/topics');
  andThen(function() {
      assert.equal($(".discover-topic input[name='music']").prop('checked'), true, "Checkbox was not checked");
      assert.equal($(".discover-topic input[name='art']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
      assert.equal($(".discover-topic input[name='technology']").prop('checked'), false, "Checkbox was checked when it shouldn't be");
  });
});
