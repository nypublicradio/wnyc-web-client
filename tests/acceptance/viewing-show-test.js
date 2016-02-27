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
  let showAttrs = server.create('show', { id: 'shows/show-slug/' });

  bootstrapChannelHTML(showAttrs);

  showPage.visit(showAttrs);

  andThen(function() {
    assert.equal(currentURL(), '/shows/show-slug/');
  });
});

test('using a nav-link', function(assert) {
  let showAttrs = server.create('show', {
    id: 'shows/show-slug/',
    linkroll: [
      {"href": null, "navSlug": "episodes", "title": "Episodes"},
      {"href": null, "navSlug": "next-link", "title": "Next Link"}
    ]
  });

  let apiResponse = server.create('api-response', { id: 'shows/show-slug/next-link/1' });
  server.create('story', {
    apiResponseId: apiResponse.id,
    title: "Story Title"
  });

  bootstrapChannelHTML(showAttrs);

  showPage.visit(showAttrs).clickNavLink('Next Link');

  andThen(() => {
    assert.deepEqual(showPage.storyTitles(), ["Story Title"]);
  });
});


function bootstrapChannelHTML(show) {
  appendHTML(`
    <script type="text/x-wnyc-marker" data-url="${show.id}"></script>
  `);

  // Create server models
  let apiResponse = server.create('api-response', {
    id: `${show.id}${show.linkroll[0].navSlug}/1`
  });
  let story = server.create('story', { apiResponseId: apiResponse.id });

  let serializedShow = serialize(server.schema.find('show', show.id));
  let serializedApiResponse = serialize(server.schema.find('apiResponse', apiResponse.id));
  let serializedStory = serialize(server.schema.find('story', story.id));

  serializedShow.included = [
    serializedApiResponse.data,
    serializedStory.data
  ];

  appendHTML(`
    <script id="wnyc-channel-jsonapi" type="application/vnd.api+json">
      ${JSON.stringify({[show.id]: serializedShow })}
    </script>
  `);
}
