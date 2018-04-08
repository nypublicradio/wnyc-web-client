import { currentURL, visit, find } from '@ember/test-helpers';
import test from 'ember-sinon-qunit/test-support/test';
import homePage from 'wnyc-web-client/tests/pages/home';

import { setupApplicationTest } from 'ember-qunit';
import { module } from 'qunit';

module('Acceptance | home', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('stream');
  });

  test('visiting /', async function(assert) {
    server.create('django-page', {id: '/'});
    await homePage
      .bootstrap()
      .visit();

    assert.equal(currentURL(), '/');
    assert.ok(find('.django-content'));
  });

  test('.l-constrained is added to the home page', async function(assert) {
    server.create('django-page', {
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

    await homePage
      .bootstrap()
      .visit();

    assert.ok(find('.l-constrained .django-content'), 'should have an l-constrained class');
  });

  test('home page does dfp targeting', async function() /*assert*/{
    server.create('django-page', {id: '/'});

    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    server.create('django-page', {id: 'foo/'});
    await visit('/foo');

    this.mock(this.owner.lookup('route:index').get('googleAds'))
      .expects('doTargeting')
      .once();

    await homePage
      .bootstrap()
      .visit();
  });
});
