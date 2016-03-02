import { test } from 'qunit';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';
import djangoPage from 'overhaul/tests/pages/django-page';
import {
  appendHTML,
  resetHTML 
} from 'overhaul/tests/helpers/html';

moduleForAcceptance('django-page leaves alien dom alone', {
  afterEach() {
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

moduleForAcceptance('django-page and alien clicks', {
  afterEach() {
    resetHTML();
  }
});

test('lets # links pass though', function(assert) {
  let page = server.create('django-page');

  appendHTML('<a href="#" id="link">click</a><div id="output"></div>');
  djangoPage
    .bootstrap(page)
    .visit(page);

  document.addEventListener('click', function bar(e) {
    if (e.target.id === 'link') {
      e.preventDefault();
      let output = document.getElementById('output');
      output.textContent = 'foo';
    }
    document.removeEventListener('click', bar);
  }, false);

  andThen(() => {
    djangoPage.alienClick('#link');
  });

  andThen(() => {
    assert.equal(find('#output').text(), 'foo');
    assert.notOk(location.hash);
  });
});
