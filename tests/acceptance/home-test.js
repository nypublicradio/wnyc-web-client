import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from'wqxr-web-client/tests/helpers/module-for-acceptance';
import djangoPage from'wqxr-web-client/tests/pages/django-page';

moduleForAcceptance('Acceptance | home', {
  beforeEach() {
    server.create('stream');
  }
});

test('visiting /', function(assert) {
  server.create('django-page', {id: '/'});
  djangoPage
    .bootstrap({id: '/'})
    .visit({id: '/'});

  andThen(function() {
    assert.equal(currentURL(), '/');
    let djangoContent = findWithAssert('.django-content');
    assert.ok(djangoContent.contents().length);
  });
});

test('.l-constrained is added to the home page', function(assert) {
  let home = server.create('django-page', {
    id: '/',
    text: `
    <div>
      <div>
    this is a regular template
      </div>
    </div>
    `
  });

  djangoPage
    .bootstrap(home)
    .visit(home);

  andThen(function() {
    assert.equal(find('.django-content').parent('.l-constrained').length, 1, 'should have an l-constrained class');
  });
});

test('home page does dfp targeting', function(/*assert*/) {
  server.create('django-page', {id: '/'});

  this.mock(this.application.__container__.lookup('route:index').get('googleAds'))
    .expects('doTargeting')
    .once();
  
  djangoPage
    .bootstrap({id: '/'})
    .visit({id: '/'});
});
