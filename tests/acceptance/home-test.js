import { test, skip } from 'qunit';
import moduleForAcceptance from 'wqxr-web-client/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | home', {
  beforeEach() {
    server.create('bucket', {slug: 'wqxr-home'});
    server.createList('stream', 7);
    server.createList('whats-on', 7);
  }
});

test('visiting /', function(assert) {
  setBreakpoint('mediumAndUp');
  visit('/');

  andThen(function() {
    assert.equal(find('.stream-banner').length, 1, 'stream banner should render at larger breakpoint');
    assert.equal(find('.stream-carousel').length, 0, 'stream carousel should not render at larger breakpoint');
    
    setBreakpoint('smallAndUp');
  });
  
  andThen(function() {
    assert.equal(find('.stream-banner').length, 0, 'stream banner should not render at smaller breakpoint');
    assert.equal(find('.stream-carousel').length, 1, 'stream carousel should render at smaller breakpoint');
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
