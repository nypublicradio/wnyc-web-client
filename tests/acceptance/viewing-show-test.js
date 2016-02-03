import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import serialize from 'overhaul/mirage/utils/serialize';
import showPage from 'overhaul/tests/pages/show';

moduleForAcceptance('Acceptance | viewing show', {
  beforeEach() {
    $('#ember-testing').empty();
    $('<script type="text/x-wnyc-marker" data-url="shows/show-slug/"></script>').appendTo('#ember-testing');
    $('<div/>', {id: 'js-listings'}).appendTo('#ember-testing');
  }
});

test('visiting a show - smoke test', function(assert) {
  let showAttrs = server.build('show', {
    slug: 'show-slug',
    linkroll: [
      { "href": null, "navSlug": "episodes", "title": "Episodes" }
    ]
  });
  bootstrapListingGlobal(showAttrs);

  showPage.visit(showAttrs);

  andThen(function() {
    assert.equal(currentURL(), '/shows/show-slug/');
  });
});

test('using a nav-link', function(assert) {
  let showAttrs = server.build('show', {
    slug: 'show-slug',
    linkroll: [
      {"href": null, "navSlug": "episodes", "title": "Episodes"},
      {"href": null, "navSlug": "next-link", "title": "Next Link"}
    ]
  });
  bootstrapListingGlobal(showAttrs);

  let apiResponse = server.create('api-response', { id: 'shows/show-slug/next-link/1' });
  server.create('story', {
    apiResponseId: apiResponse.id,
    title: "Story Title"
  });

  showPage.visit(showAttrs).clickNavLink('Next Link');

  andThen(() => {
    assert.deepEqual(showPage.storyTitles(), ["Story Title"]);
  });
});


function bootstrapListingGlobal(showAttrs) {
  // Create server models
  let apiResponse = server.create('api-response', {
    id: `${showAttrs.id}episodes/1`,
  });
  let story = server.create('story', { apiResponseId: apiResponse.id });
  let show = server.create('show', showAttrs);

  // Serialize models
  let serializedShow = serialize(server.schema.find('show', show.id));
  let serializedApiResponse = serialize(server.schema.find('apiResponse', apiResponse.id));
  let serializedStory = serialize(server.schema.find('story', story.id));

  let jsonApiResponse = {included: []};
  jsonApiResponse.data = serializedShow.data;
  jsonApiResponse.included.push(serializedApiResponse.data);
  jsonApiResponse.included.push(serializedStory.data);

  let string = JSON.stringify({[showAttrs.id]: jsonApiResponse });
  let element = $('<script/>', {id: 'wnyc-channel-jsonapi', type: 'application/vnd.api+json'});
  element.html(string);
  element.appendTo('#ember-testing');
}
