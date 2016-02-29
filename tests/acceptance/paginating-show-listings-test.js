import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import showPage from 'overhaul/tests/pages/show';
import { appendHTML, resetHTML } from 'overhaul/tests/helpers/html';

moduleForAcceptance('Acceptance | paginating show listings', {
  beforeEach() {
    appendHTML('<div id="js-listings"></div>');
  },

  afterEach() {
    resetHTML();
  }
});

test('showing pagination for a list of episodes', function(assert) {
  let show = server.create('show');

  showPage
    .bootstrap(show)
    .visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 1, 'is showing pagination');
  });
});



