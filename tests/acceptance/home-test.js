import { skip } from 'qunit';
import test from 'ember-sinon-qunit/test-support/test';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | home', {
  beforeEach() {
    server.create('bucket', {slug: 'wqxr-home'});
    server.createList('stream', 7);
    server.createList('whats-on', 7);
  }
});

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.stream-banner').length, 1, 'stream banner should render');
  });  
});

skip('using stream banner', function(assert) {
  setBreakpoint('mediumAndUp');
  visit('/');
  selectChoose('.stream-banner .ember-basic-dropdown', '.ember-power-select-option:eq(3)');

  andThen(function() {
    let whatsOn4 = server.schema.whatsOns.all().models[3];
    let { title } = whatsOn4.attrs.current_playlist_item.catalog_entry;
    assert.ok(find('.streambanner-title').text().match(title), 'show display current playlist item');
  });
});

test('home page does dfp targeting', function(/*assert*/) {
  this.mock(this.application.__container__.lookup('route:index').get('googleAds'))
    .expects('doTargeting')
    .once();
  
  visit('/');
});
