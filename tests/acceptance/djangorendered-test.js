import config from 'wqxr-web-client/config/environment';
import test from 'ember-sinon-qunit/test-support/test';
import { skip } from 'qunit';
import { plantBetaTrial } from 'wqxr-web-client/tests/helpers/beta';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';
import djangoPage from 'wqxr-web-client/tests/pages/django-page';
import Ember from 'ember';
const { wnycURL } = config;
import {
  resetHTML
} from 'wqxr-web-client/tests/helpers/html';
import 'wqxr-web-client/tests/helpers/hifi-acceptance-helper';

function escapeNavigation() {
  return 'leaving';
}

moduleForAcceptance('Acceptance | Django Rendered | Proper Re-renders', {
  beforeEach() {
    server.create('stream');
    window.onbeforeunload = escapeNavigation;
  },
  afterEach() {
    window.onbeforeunload = undefined;
    resetHTML();
  }
});

skip('on the homepage', function(assert) {
  server.create('bucket');
  let home = server.create('django-page', {id: '/'});
  djangoPage
    .bootstrap(home)
    .visit(home);

  andThen(function() {
    assert.equal(currentURL(), '/');
    let djangoContent = findWithAssert('.django-content');
    assert.ok(djangoContent.contents().length);
  });
});

test('on a search page with a query', function(assert) {
  let search = server.create('django-page', {id: 'search/?q=foo'});
  djangoPage
    .bootstrap(search)
    .visit({id: 'search/?q=foo'});

  andThen(function() {
    assert.equal(currentURL(), 'search/?q=foo');
    let djangoContent = findWithAssert('.django-content');
    assert.ok(djangoContent.contents().length);
  });
});

skip('it properly routes to the search page', function(assert) {
  let home = server.create('django-page', {id: '/'});
  server.create('django-page', {id: 'search/?q=foo'});
  server.create('bucket');

  djangoPage
    .bootstrap(home)
    .visit(home);

  fillIn('#search-input', 'foo');
  triggerEvent('#search-form', 'submit');

  andThen(function() {
    assert.equal(currentURL(), '/search/?q=foo');
  });
});

skip('it retries the server on a request error', function(assert) {
  assert.expect(1);
  // we do this in order to simulate the unrecoverable errors generated when
  // Ember tries to AJAX load a url from another domain.
  server.get(`${config.wnycURL}/unknown-url/`, () => {throw 'simulating a CORS error';});

  window.assign = function() {
    assert.ok(true, 'location.assign was called');
  };

  visit('/unknown-url')
    .catch(() => delete window.assign);
});

test('deferred scripts embedded within content do not run twice', function(assert) {
  let page = server.create('django-page', {
    id: 'story/foo/',
    slug: 'foo',
    body: `
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

  andThen(function() {
    assert.equal(find('section.text p').length, 1, 'should only be one p tag');
  });
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

  andThen(function() {
    assert.equal(find('.django-content').parent('.l-constrained').length, 0, 'should not have an l-constrained class');
  });
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

  andThen(function() {
    assert.equal(find('.django-content').parent('.l-constrained').length, 1, 'should have an l-constrained class');
  });
});

test('.search is added to search pages', function(assert) {
  let searchPage = server.create('django-page', { id: 'search/' });

  djangoPage
    .bootstrap(searchPage)
    .visit(searchPage);

  andThen(function() {
    assert.equal(find('.django-content').parent('.search').length, 1, 'should have an l-constrained class');
  });
});


test('arbitrary django routes do dfp targeting', function(/*assert*/) {
  server.create('django-page', {id: 'fake/'});

  this.mock(this.application.__container__.lookup('route:djangorendered').get('googleAds'))
    .expects('doTargeting')
    .once();
  
  djangoPage
    .bootstrap({id: 'fake/'})
    .visit({id: 'fake/'});
});

moduleForAcceptance('Acceptance | Django Rendered | Beta Trial', {
  beforeEach() {
    server.create('stream');
    window.onbeforeunload = escapeNavigation;
    config.betaTrials.active = true;
    config.betaTrials.preBeta = true;
  },
  afterEach() {
    window.onbeforeunload = undefined;
    resetHTML();
  }
});

skip('alien doms with beta trials keep the beta bar if it has not been dismissed', function(assert) {
  plantBetaTrial();

  let djangoHTML = `<a href="${wnycURL}/foo" id="link">click me</a>`;
  let page = server.create('django-page', {testMarkup: djangoHTML});
  server.create('django-page', {id: 'foo/'});

  djangoPage
    .bootstrap(page)
    .visit(page)
    .alienClick('#link');

  andThen(() => {
    assert.equal(currentURL(), '/foo');
  });
  andThen(() => {
    assert.ok(Ember.$('[data-test-selector=beta-tease]').length, 'beta trial tease is visible afer transition');
  });
});
