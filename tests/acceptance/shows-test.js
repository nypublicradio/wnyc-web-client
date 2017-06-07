import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | shows', {
  beforeEach() {
    server.create('stream');
  },
});


test('visiting /shows', function(assert) {
  server.createList('show', 10);
  server.create('bucket', {slug: 'wnyc-shows-featured'});
  
  visit('/shows');

  andThen(function() {
    assert.equal(currentURL(), '/shows');

    //one show is featured
    //we're disabling this featured show module for now
    //assert.equal( $('.l-highlight--geometric .flag').length, 1, "one featured item is present");
    
    //10 shows are listed, per test data
    assert.equal(find('.shows-list ul li').length, 10, "ten shows are listed" );

    //ad is there
    assert.equal(find('#leaderboard').length, 1, "ad is present" );
  });
});

test('searching /shows', function(assert) {
  server.createList('show', 10);
  server.create('bucket', {slug: 'wnyc-shows-featured'});
  visit('/shows');

  andThen(function() {
    fillIn(".shows-search .searchbox--shows input", "ra");
    keyEvent('.shows-search .searchbox--shows input', 'keyup');
    andThen(function() {  
      //no longer expect 10 shows
      assert.notEqual(find('.shows-list li').length, 10, "filtering results in less than 10 shows");
    });
  });

  server.create('djangoPage', {id:'/'});
  visit('/');
  visit('/shows');

  andThen(function() {
    assert.equal(find('.shows-list li').length, 10, "all shows visible after navigating");
  });
});
  

test('searching with no results /shows', function(assert) {
  server.createList('show', 10);
  server.create('bucket', {slug: 'wnyc-shows-featured'});
  visit('/shows');
  fillIn(".shows-search .searchbox--shows input", "Nonsense Message");
  keyEvent('.shows-search .searchbox--shows input', 'keyup', 13);

  //show the no results found message
  andThen(function() {
    assert.equal(find(".shows-list").text().trim(), "Sorry, but no matching shows were found. Try a different spelling or other words in the title of the show you're looking for. If you're looking for something other than a show name, try searching the rest of the website.", "No results message displays");
  });

});

test('show routes do dfp targeting', function(/*assert*/) {
  this.mock(this.application.__container__.lookup('route:show').get('googleAds'))
    .expects('doTargeting')
    .once();

  visit('/shows');
});
