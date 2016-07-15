import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | shows');


test('visiting /shows', function(assert) {
  server.createList('show', 10);
  server.create('bucket', {slug: 'wnyc-shows-featured'});
  visit('/shows');

  andThen(function() {
    assert.equal(currentURL(), '/shows');

    //one show is featured
    assert.equal( $('.l-highlight--geometric .flag').length, 1, "one featured item is present");

    //10 shows are listed, per test data
    assert.equal( $('.shows-list ul li').length, 10, "ten shows are listed" );

    //ad is there
    assert.equal( $('#leaderboard').length, 1, "ad is present" );

  });
});

test('searching /shows', function(assert) {
  server.createList('show', 10);
  server.create('bucket', {slug: 'wnyc-shows-featured'});
  visit('/shows');

  andThen(function() {
    fillIn(".searchbox input", "ra");
    keyEvent('.searchbox input', 'keyup');
    andThen(function() {  
      //no longer expect 10 shows
      assert.notEqual($('.shows-list li').length, 10, "filtering results in less than 10 shows");
    });

  });
});
  

test('searching with no results /shows', function(assert) {
  server.createList('show', 10);
  server.create('bucket', {slug: 'wnyc-shows-featured'});
  visit('/shows');
  fillIn(".searchbox input", "Nonsense Message");
  keyEvent('.searchbox input', 'keyup', 13);
  
  //show the no results found message
  andThen(function() {  
    assert.equal(this.$(".shows-list").text().trim(), 'no results found', "No results message displays");
  });

});
