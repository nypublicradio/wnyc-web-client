import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import serialize from 'overhaul/mirage/utils/serialize';
import showPage from 'overhaul/tests/pages/show';
import { appendHTML, resetHTML } from 'overhaul/tests/helpers/html';

moduleForAcceptance('Acceptance | viewing show', {
  beforeEach() {
    appendHTML('<div id="js-listings"></div>');
  },

  afterEach() {
    resetHTML();
  }
});

test('visiting a show - smoke test', function(assert) {
  let show = server.create('show');

  bootstrapChannelHTML(show);

  showPage.visit(show);

  andThen(function() {
    assert.equal(currentURL(), `/${show.id}`);
  });
});

test('using a nav-link', function(assert) {
  let show = server.create('show', {
    linkroll: [
      {"href": null, "navSlug": "episodes", "title": "Episodes"},
      {"href": null, "navSlug": "next-link", "title": "Next Link"}
    ]
  });

  let story = server.create('story', {
    title: "Story Title"
  });

  server.create('api-response', {
    id: `${show.id}${show.linkroll[1].navSlug}/1`,
    teaseList: [server.schema.story.find(story.id)]
  });

  bootstrapChannelHTML(show);

  showPage.visit(show).clickNavLink('Next Link');

  andThen(() => {
    assert.deepEqual(showPage.storyTitles(), ["Story Title"]);
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
      ${JSON.stringify({[show.id]: serializedShow })}
    </script>
  `);
}
