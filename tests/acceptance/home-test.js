import { findAll, find, visit } from '@ember/test-helpers';
import { module, skip } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';

module('Acceptance | home', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    server.create('bucket', {slug: 'wqxr-home'});
    server.createList('stream', 7);
    server.createList('whats-on', 7);
  });

  test('visiting /', async function(assert) {
    await visit('/');

    assert.equal(findAll('.stream-banner').length, 1, 'stream banner should render');  
  });

  skip('using stream banner', async function(assert) {
    setBreakpoint('mediumAndUp');
    await visit('/');
    selectChoose('.stream-banner .ember-basic-dropdown', '.ember-power-select-option:eq(3)');

    let whatsOn4 = server.schema.whatsOns.all().models[3];
    let { title } = whatsOn4.attrs.current_playlist_item.catalog_entry;
    assert.ok(find('.streambanner-title').textContent.match(title), 'show display current playlist item');
  });

  test('home page does dfp targeting', async function() /*assert*/{
    // https://github.com/emberjs/ember.js/issues/14716#issuecomment-267976803
    await visit('/foo');
    
    this.mock(this.application.__container__.lookup('route:index').get('googleAds'))
      .expects('doTargeting')
      .once();
    
    await visit('/');
    
  });
});
