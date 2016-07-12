import config from 'overhaul/config/environment';
import { skip, test } from 'qunit';
import { plantBetaTrial } from 'overhaul/tests/helpers/beta';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import 'overhaul/tests/helpers/with-feature';
import Ember from 'ember';
const { wnycURL } = config;
import {
  resetHTML
} from 'overhaul/tests/helpers/html';

function escapeNavigation() {
  return 'leaving';
}

moduleForAcceptance('Acceptance | Django Rendered | Proper Re-renders', {
  beforeEach() {
    window.onbeforeunload = escapeNavigation;
  },
  afterEach() {
    window.onbeforeunload = undefined;
    resetHTML();
  }
});

test('on the homepage', function(assert) {
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

test('it properly routes to the search page', function(assert) {
  withFeature('django-page-routing');
  let home = server.create('django-page', {id: '/'});
  server.create('django-page', {id: 'search/?q=foo'});

  djangoPage
    .bootstrap(home)
    .visit(home);

  fillIn('#search-input', 'foo');
  triggerEvent('#search-form', 'submit');

  andThen(function() {
    assert.equal(currentURL(), '/search/?q=foo');
  });
});

test('it retries the server on a request error', function(assert) {
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
  let page = server.create('djangoPage', {
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

moduleForAcceptance('Acceptance | Django Rendered | Beta Trial', {
  beforeEach() {
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

  withFeature('django-page-routing');
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

moduleForAcceptance('Acceptance | Django Rendered | Play From Param', {
  beforeEach() {
    window.onbeforeunload = escapeNavigation;
  },
  afterEach() {
    window.onbeforeunload = undefined;
    resetHTML();
  }
});

test('loading a page with the ?play param', function(assert) {
  Ember.$.Velocity.mock = true;
  
  let id = '123';
  
  server.create('story', {id, title: 'Foo'});
  let home = server.create('django-page', {id: `/bar?play=${id}`});
  djangoPage
    .bootstrap(home)
    .visit(home);

  andThen(() => {
    assert.ok(Ember.$('.persistent-player').length, 'persistent player should be visible');
    assert.equal(Ember.$('[data-test-selector=persistent-player-story-title]').text(), 'Foo', 'Foo story should be loaded in player UI');
  });
});

test('loading a page with a bad ?play param', function(assert) {
  Ember.$.Velocity.mock = true;
  
  let id = '1';
  let home = server.create('django-page', {id: `/bar?play=${id}`});
  djangoPage
    .bootstrap(home)
    .visit(home);
  
  andThen(() => {
    assert.notOk(Ember.$('.persistent-player').length, 'persistent player should not be visible');
  });
});

test('deferred scripts embedded within content do not run twice', function(assert) {
  // TODO: remove once https://github.com/nypublicradio/puppysite/pull/202 lands
  server.create('story', {slug: 'foo'});
  //
  let page = server.create('djangoPage', {
    id: 'story/foo/',
    slug: 'foo',
    body: `
<script type="text/javascript-deferred">
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

