import config from 'wnyc-web-client/config/environment';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { canonicalize  } from 'wnyc-web-client/services/script-loader';
let { wnycURL } = config;
wnycURL = canonicalize(wnycURL);

moduleForComponent('nav-links', 'Integration | Component | nav links', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{nav-links}}`);

  assert.equal(this.$().text().trim(), 'Sub Nav');
});

test('it properly sets the activeTab if defaultTab is undefined', function(assert) {
  this.set('defaultTab', undefined);
  this.set('links', [
    {href: null, navSlug: 'foo', title: 'Foo'},
    {href: 'http://example.com', title: 'Example'}
  ]);
  this.set('navRoot', 'baz/bar');
  this.render(hbs`{{nav-links defaultSlug=defaultSlug navRoot=navRoot links=links}}`);

  assert.equal(this.$('.is-active').text().trim(), 'Foo', 'first link should be active');
});

test('it properly parses incoming linkroll links', function(assert) {

  this.set('links', [
    {href: `${wnycURL}foo/bar/`, title: 'Example'}
  ]);
  this.render(hbs`{{nav-links links=links}}`);
  assert.equal(this.$('.is-active a').attr('href'), '/foo/bar/', 'links with matching origins have a leading slash');
});
