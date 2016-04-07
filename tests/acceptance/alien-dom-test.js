import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import DjangoRenderedController from 'overhaul/controllers/django-rendered';
import 'ember-feature-flags/tests/helpers/with-feature';
import ENV from 'overhaul/config/environment';
const { wnycURL } = ENV;
import {
  resetHTML
} from 'overhaul/tests/helpers/html';

function escapeNavigation() {
  return 'leaving';
}

DjangoRenderedController.reopen({ queryParams: ['bar'] });

moduleForAcceptance('django-page leaves alien dom alone', {
  beforeEach() {
    window.beforeunload = escapeNavigation;
  },
  afterEach() {
    window.beforeunload = undefined;
    resetHTML();
  }
});

test('on homepage', function(assert) {
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

test('on a search page with a query', function(assert) {
  // django will only append the path, not the query string
  let search = server.create('django-page', {id: 'search/'});
  djangoPage
    .bootstrap(search)
    .visit({id: 'search/?q=foo'});

  andThen(function() {
    assert.equal(currentURL(), 'search/?q=foo');
    let djangoContent = findWithAssert('.django-content');
    assert.notOk(djangoContent.contents().length);
  });
});

test('alien anchor tag clicks route like link-tos', function(assert) {

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

test('alien anchor tag clicks with query strings route OK', function(assert) {

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
