import { module, test } from 'qunit';
import { shouldHandleLink, normalizeHref } from 'overhaul/instance-initializers/link-handler';
import ENV from 'overhaul/config/environment';
import { canonicalize } from 'overhaul/services/script-loader';
let { wnycURL } = ENV;
wnycURL = canonicalize(wnycURL);

// don't actually need to initialize the app, since we're just testing how the 
// link handler deals with incoming href values
module('Unit | Instance Initializer | link handler');

function makeAnchor(attrs) {
  var a = document.createElement('a');
  Object.keys(attrs).forEach(k => a.setAttribute(k, attrs[k]));
  return a;
}

const linksToIgnore = [
  { node: makeAnchor({'href': 'http://www.example.com', 'target': '_blank'}), label: 'target=_blank' },
  { node: makeAnchor({'href': 'http://www.example.com', 'class': 'ember-view'}), label: 'ember-view' },
  { node: makeAnchor({'href': 'http://www.example.com', 'class': 'stf'}), label: 'admin links' },
  { node: makeAnchor({'data-ember-action': 'foo'}), label: 'ember action' },
  { node: makeAnchor({'href': '#'}), label: 'hash href' },
  { node: makeAnchor({'href': 'mailto:'}), label: 'mailto href' },
  { node: makeAnchor({'href': 'http://foo.com'}), label: 'other domain' },
  { node: makeAnchor({'href': 'http://foo.com/file.pdf'}), label: 'absolute url to a file' },
  { node: makeAnchor({'href': '/file.pdf'}), label: 'root-relative url to a file' },
];

test('shouldHandleLink for invalid links', function(assert) {
  linksToIgnore.forEach(l => assert.notOk(shouldHandleLink(l.node), l.label));
});

test('shouldHandleLink for valid links', function(assert) {
  let a = document.createElement('a');
  a.href = `${wnycURL}foo`;
  assert.ok(shouldHandleLink(a), 'should handle urls on this domain');
  a.href = '/foo';
  assert.ok(shouldHandleLink(a), 'should handle root-relative URLs');
});

test('normalizeHref should return expected values', function(assert) {
  let a = document.createElement('a');
  a.href = '#foo';
  let ops = normalizeHref(a);
  assert.equal(ops.href, '#foo', 'return a hash for a hash');
  ops = normalizeHref(a, wnycURL);
  assert.equal(ops.href, '#foo', 'return a hash for a hash on wnycURL');
  const oldUrl = wnycURL;
  wnycURL += '?foo=bar';
  ops = normalizeHref(a, wnycURL);
  assert.equal(ops.href, '#foo', 'return a hash for a hash on wnycURL with a query string');
  wnycURL = oldUrl;

  a.href = `/foo/bar`;
  ops = normalizeHref(a, wnycURL);
  assert.deepEqual(ops, {url: `${wnycURL}foo/bar`, href: 'foo/bar', isExternal: false }, 'root-relative hrefs');

  a.href = `${wnycURL}foo/bar`;
  ops = normalizeHref(a, wnycURL);
  assert.deepEqual(ops, {url: `${wnycURL}foo/bar`, href: 'foo/bar', isExternal: false }, 'absolute urls');

  a.href = `mailto:`;
  ops = normalizeHref(a, wnycURL);
  assert.deepEqual(ops, {url: `mailto:`, href: 'mailto:', isExternal: false }, 'mailto:');
});
