import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import showPage from 'overhaul/tests/pages/show';
import serialize from 'overhaul/mirage/utils/serialize';
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

  bootstrapChannelHTML(show);

  showPage.visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 1, 'is showing pagination');
  });
});

function bootstrapChannelHTML(show) {
  let showModel = server.schema.show.find(show.id);
  let serializedShow = serialize(showModel);

  appendHTML(`
    <script type="text/x-wnyc-marker" data-url="${show.id}"></script>
  `);

  appendHTML(`
    <script id="wnyc-channel-jsonapi" type="application/vnd.api+json">
      ${JSON.stringify({ [show.id]: serializedShow })}
    </script>
  `);
}
