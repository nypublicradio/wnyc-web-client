import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import serialize from 'overhaul/mirage/utils/serialize';
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
  let show = server.create('show', {
    id: 'shows/show-slug/',
    linkroll: [
      {"href": null, "navSlug": "episodes", "title": "Episodes"}
    ]
  });

  let apiResponse = server.create('api-response', {
    id: 'shows/show-slug/episodes/1',
    totalCount: 11
  });

  server.createList('story', 5, { apiResponseId: apiResponse.id });

  bootstrapChannelHTML(show, apiResponse);

  showPage.visit(show);

  andThen(function() {
    assert.equal(find('#pagefooter').length, 1, 'is showing pagination');
  });
});

function bootstrapChannelHTML(show, apiResponse) {
  appendHTML(`
    <script type="text/x-wnyc-marker" data-url="${show.id}"></script>
  `);

  let showModel = server.schema.show.find(show.id);
  let serializedShow = serialize(showModel);
  let apiResponseModel = server.schema.apiResponse.find(apiResponse.id);

  serializedShow.included = [
    serialize(apiResponseModel).data,
    ...apiResponseModel.teaseList.map((s) => serialize(s).data)
  ];

  appendHTML(`
    <script id="wnyc-channel-jsonapi" type="application/vnd.api+json">
      ${JSON.stringify({ [show.id]: serializedShow })}
    </script>
  `);
}
