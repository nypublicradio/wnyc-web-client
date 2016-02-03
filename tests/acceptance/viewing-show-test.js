import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import serialize from 'overhaul/mirage/utils/serialize';
import showPage from 'overhaul/tests/pages/show';

moduleForAcceptance('Acceptance | viewing show', {
  beforeEach() {
    window.wnyc = {
      listing: {},
      user: {
        staffLinks() {}
      }
    };
  },

  afterEach() {
    window.wnyc = undefined;
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
  let showModel = server.schema.show.create(showAttrs);
  showModel.createStory();
  let apiResponseModel = server.schema.apiResponse.create({
    id: `${showAttrs.id}/episodes/1`
  });

  // Serialize models
  let serializedShow = serialize(showModel);
  let serializedApiResponse = serialize(apiResponseModel);
  serializedShow.included.push(serializedApiResponse.data);

  window.wnyc.listing = { [showAttrs.id]: serializedShow };
}
