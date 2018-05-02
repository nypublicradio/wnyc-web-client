import {
  fillIn,
  triggerKeyEvent,
  findAll,
  currentURL,
  find,
  visit
} from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

module('Acceptance | shows', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });


  test('visiting /shows', async function(assert) {
    server.createList('show', 10);
    server.create('bucket', {slug: 'wnyc-shows-featured'});

    await visit('/shows');

    assert.equal(currentURL(), '/shows');

    //one show is featured
    //we're disabling this featured show module for now
    //assert.equal( $('.l-highlight--geometric .flag').length, 1, "one featured item is present");

    //10 shows are listed, per test data
    assert.equal(findAll('.shows-list ul li').length, 10, "ten shows are listed" );

    //ad is there
    assert.equal(findAll('#leaderboard').length, 1, "ad is present" );
  });

  test('searching /shows', async function(assert) {
    server.createList('show', 10);
    await visit('/shows');

    await fillIn(".shows-search .searchbox--shows input", "ra");
    await triggerKeyEvent('.shows-search .searchbox--shows input', 'keyup', '65');
    //no longer expect 10 shows
    assert.notEqual(findAll('.shows-list li').length, 10, "filtering results in less than 10 shows");

    server.create('bucket', {slug: 'wqxr-home'});
    server.create('djangoPage', {id:'/'});
    await visit('/');
    await visit('/shows');

    assert.equal(findAll('.shows-list li').length, 10, "all shows visible after navigating");
  });


  test('searching with no results /shows', async function(assert) {
    server.createList('show', 10);
    server.create('bucket', {slug: 'wnyc-shows-featured'});
    await visit('/shows');
    await fillIn(".shows-search .searchbox--shows input", "Nonsense Message");
    await triggerKeyEvent('.shows-search .searchbox--shows input', 'keyup', '13');

    assert.equal(find(".shows-list").textContent.trim(), "Sorry, but no matching shows were found. Try a different spelling or other words in the title of the show you're looking for. If you're looking for something other than a show name, try searching the rest of the website.", "No results message displays");

  });

  test('show routes do dfp targeting', async function() /*assert*/{
    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    await visit('/');

    this.mock(this.owner.lookup('route:show').get('googleAds'))
      .expects('doTargeting')
      .once();

    await visit('/shows');
  });
});
