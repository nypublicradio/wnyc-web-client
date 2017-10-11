import { test } from 'qunit';
import moduleForAcceptance from 'wnyc-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wnyc-web-client/tests/pages/django-page';

moduleForAcceptance('Acceptance | data layer');

test('confirming data layer showTitle is present on show page', function(assert) {
	window.dataLayer = [];

  let listingPage = server.create('listing-page', {
    id: 'shows/foo/',
    linkroll: [
      {'nav-slug': 'episodes', title: 'Episodes'}
    ],
    socialLinks: [{title: 'facebook', href: 'http://facebook.com'}],
    apiResponse: server.create('api-response', { id: 'shows/foo/episodes/1' })
  });
  server.create('django-page', {id: listingPage.id});

  djangoPage
    .bootstrap(listingPage)
    .visit(listingPage);

  andThen(function() {
    assert.deepEqual(window.dataLayer.slice(-1)[0], {showTitle: listingPage.title});
  });
});
