import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import {
  appendHTML,
  resetHTML,
  alienDOMMarker } from 'overhaul/tests/helpers/html';

moduleForAcceptance('django-page leaves alien dom alone', {
  afterEach() {
    resetHTML();
  }
});
test('on homepage', function(assert) {
  let homePage = server.create('django-page', {id: '/'});
  appendHtml(homePage.text);

  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
    let djangoContent = find('.django-content');
    assert.notOk(djangoContent.contents().length);
  });
});

test('on a search page with a query', function(assert) {
  let search = server.create('django-page', {id: 'search/?q=foo'});
  appendHtml(search.text);

  visit('search/?q=foo');
  andThen(function() {
    assert.equal(currentURL(), 'search/?q=foo');
    let djangoContent = find('.django-content');
    assert.notOk(djangoContent.contents().length);
  });
});

moduleForAcceptance('django-page and alien clicks', {
  afterEach() {
    resetHTML();
  }
});
test('lets # links pass though', function(assert) {
  appendHTML('<a href="#" id="link">click</a>');
  appendHTML('<div id="output"></div>');

  document.addEventListener('click', function bar(e) {
    if (e.target.id === 'link') {
      e.preventDefault();
      let output = document.getElementById('output');
      output.textContent = 'foo';
    }
    document.removeEventListener('click', bar);
  }, false);

  let link = document.getElementById('link');
  link.click();
  andThen(() => {
    assert.equal(find('#output').text(), 'foo');
    assert.notOk(location.hash);
  });
});
