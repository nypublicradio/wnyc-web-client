import {
  fillIn,
  findAll,
  currentURL,
  triggerEvent,
  visit
} from '@ember/test-helpers';
import config from 'wqxr-web-client/config/environment';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import 'wqxr-web-client/tests/helpers/hifi-acceptance-helper';

function escapeNavigation() {
  return 'leaving';
}

module('Acceptance | Django Rendered | Proper Re-renders', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
    window.onbeforeunload = escapeNavigation;
  });

  hooks.afterEach(function() {
    window.onbeforeunload = undefined;
  });

  test('on a search page with a query', function(assert) {
    let search = server.create('django-page', {id: 'search/?q=foo'});
    djangoPage
      .bootstrap(search)
      .visit({id: 'search/?q=foo'});

    assert.equal(currentURL(), 'search/?q=foo');
    let djangoContent = findWithAssert('.django-content');
    assert.ok(djangoContent.contents().length);
  });

  skip('it properly routes to the search page', async function(assert) {
    let home = server.create('django-page', {id: '/'});
    server.create('django-page', {id: 'search/?q=foo'});
    server.create('bucket');

    djangoPage
      .bootstrap(home)
      .visit(home);

    await fillIn('#search-input', 'foo');
    await triggerEvent('#search-form', 'submit');

    assert.equal(currentURL(), '/search/?q=foo');
  });

  skip('it retries the server on a request error', async function(assert) {
    assert.expect(1);
    // we do this in order to simulate the unrecoverable errors generated when
    // Ember tries to AJAX load a url from another domain.
    server.get(`${config.webRoot}/unknown-url/`, () => {throw 'simulating a CORS error';});

    window.assign = function() {
      assert.ok(true, 'location.assign was called');
    };

    await await await visit('/unknown-url')
      .catch(() => delete window.assign);
  });

  test('deferred scripts embedded within content do not run twice', function(assert) {
    let page = server.create('django-page', {
      id: 'foo/',
      slug: 'foo',
      text: `
      <section class="text"></section>
  <script type="text/deferred-javascript">
  (function(){

    var p = document.createElement("p");
    p.innerHTML = "Added this paragraph!";
    document.querySelector("section.text").appendChild(p);

  })();
  </script>
  `
    });

    djangoPage
      .bootstrap(page)
      .visit(page);

    assert.equal(findAll('section.text p').length, 1, 'should only be one p tag');
  });

  test('.l-constrained is not added to responsive pages', function(assert) {
    let responsivePage = server.create('django-page', {
      id: 'fake/',
      text: `
      <div>
        <div class="graphic-responsive">
        this is a responsive template
        </div>
      </div>
      `
    });

    djangoPage
      .bootstrap(responsivePage)
      .visit(responsivePage);

    assert.equal(find('.django-content').parent('.l-constrained').length, 0, 'should not have an l-constrained class');
  });

  test('.l-constrained is added to regular pages', function(assert) {
    let regularPage = server.create('django-page', {
      id: 'fake/',
      text: `
      <div>
        <div>
      this is a regular template
        </div>
      </div>
      `
    });

    djangoPage
      .bootstrap(regularPage)
      .visit(regularPage);

    assert.equal(find('.django-content').parent('.l-constrained').length, 1, 'should have an l-constrained class');
  });

  test('.search is added to search pages', function(assert) {
    let searchPage = server.create('django-page', { id: 'search/' });

    djangoPage
      .bootstrap(searchPage)
      .visit(searchPage);

    assert.equal(find('.django-content').parent('.search').length, 1, 'should have an l-constrained class');
  });

  test('arbitrary django routes do dfp targeting', async function() /*assert*/{
    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    server.create('django-page', {id: 'fake/'});

    await visit('/');
    
    this.mock(this.application.__container__.lookup('route:djangorendered').get('googleAds'))
      .expects('doTargeting')
      .once();
    
    djangoPage
      .bootstrap({id: 'fake/'})
      .visit({id: 'fake/'});
  });
});
