import config from 'overhaul/config/environment';
import { skip, test } from 'qunit';
import { plantBetaTrial } from 'overhaul/tests/helpers/beta';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import { faker  } from 'ember-cli-mirage';
import DjangoRenderedController from 'overhaul/controllers/djangorendered';
import 'overhaul/tests/helpers/with-feature';
import Ember from 'ember';
const { wnycURL } = config;
import {
  resetHTML
} from 'overhaul/tests/helpers/html';

function escapeNavigation() {
  return 'leaving';
}

DjangoRenderedController.reopen({ queryParams: ['bar'] });

moduleForAcceptance('Acceptance | Alien Dom', {
  beforeEach() {
    window.onbeforeunload = escapeNavigation;
  },
  afterEach() {
    window.onbeforeunload = undefined;
    resetHTML();
  }
});

skip('on homepage', function(assert) {
  let home = server.create('django-page', {id: '/'});
  djangoPage
    .bootstrap(home)
    .visit(home);

  andThen(function() {
    assert.equal(currentURL(), '/');
    let djangoContent = findWithAssert('.django-content');
    assert.notOk(djangoContent.contents().length);
  });
});

skip('on a search page with a query', function(assert) {
  let search = server.create('django-page', {id: 'search/?q=foo'});
  djangoPage
    .bootstrap(search)
    .visit({id: 'search/?q=foo'});

  andThen(function() {
    assert.equal(currentURL(), 'search/?q=foo');
    let djangoContent = findWithAssert('.django-content');
    assert.notOk(djangoContent.contents().length);
  });
});

skip('alien anchor tag clicks route like link-tos', function(assert) {

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
});

skip('alien anchor tag clicks with query strings route OK', function(assert) {

  withFeature('django-page-routing');
  let djangoHTML = `<a href="${wnycURL}/foo?bar=baz" id="link">click me</a>`;
  let page = server.create('django-page', {testMarkup: djangoHTML});
  server.create('django-page', {id: 'foo/?bar=baz'});

  djangoPage
    .bootstrap(page)
    .visit(page)
    .alienClick('#link');

  andThen(() => {
    assert.equal(currentURL(), '/foo?bar=baz');
  });

});

skip('alien links with bare query strings should create django-page IDs with full path', function(assert) {
  withFeature('django-page-routing');
  let djangoHTML = `<a href="?bar=baz" id="link">click me</a>`;
  let page = server.create('django-page', {id: 'fake/path/', testMarkup: djangoHTML});
  server.create('django-page', {id: '?bar=baz'});

  djangoPage
    .bootstrap(page)
    .visit(page)
    .alienClick('#link');

  andThen(() => {
    assert.equal(currentURL(), '/fake/path/?bar=baz');
  });
});

skip('imagesLoaded callback is fired for images in alien dom', function(assert) {
  let done = assert.async();
  let djangoHTML = `<img id="test" src="${faker.internet.avatar()}">`;
  let page = server.create('django-page', {testMarkup: djangoHTML});

  djangoPage
    .bootstrap(page)
    .visit(page);

  Ember.$('#ember-testing').imagesLoaded(() => {
    andThen(() => {
      assert.ok(Ember.$('#test').hasClass('is-loaded'), 'images should have is-loaded class from django-page component');
      done();
    });
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

moduleForAcceptance('Acceptance | Alien Dom | Beta Trial', {
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
