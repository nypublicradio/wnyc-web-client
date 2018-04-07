import { currentURL, visit } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import testPage from 'wnyc-web-client/tests/pages/listing-page';

import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

module('Acceptance | home', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /', async function(assert) {
    server.create('django-page', {id: '/'});
    await testPage
      .bootstrap({id: '/'})
      .visit({id: '/'});

    assert.equal(currentURL(), '/');
    let djangoContent = findWithAssert('.django-content');
    assert.ok(djangoContent.contents().length);
  });

  test('.l-constrained is added to the home page', async function(assert) {
    let home = server.create('django-page', {
      id: '/',
      text: `
      <div>
        <div>
      this is a regular template
        </div>
      </div>
      <div id="gothamist-row"></div>
    `
  });

    await testPage
      .bootstrap(home)
      .visit(home);

    assert.equal(find('.django-content').parent('.l-constrained').length, 1, 'should have an l-constrained class');
  });

  test('home page does dfp targeting', async function() /*assert*/{
    server.create('django-page', {id: '/'});

    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    server.create('django-page', {id: 'foo/'});
    await visit('/foo');

    this.mock(this.application.__container__.lookup('route:index').get('googleAds'))
      .expects('doTargeting')
      .once();

    await testPage
      .bootstrap({id: '/'})
      .visit({id: '/'});
  });
});
