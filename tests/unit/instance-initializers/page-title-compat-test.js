import Ember from 'ember';
import { initialize, titleToMeta } from 'overhaul/instance-initializers/page-title-compat';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';
import { resetHTML, appendHTML } from 'overhaul/tests/helpers/html';

module('Unit | Instance Initializer | page title compat', {
  beforeEach: function() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach: function() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
    resetHTML();
    Array.from(document.querySelectorAll('meta[name="title-for-ember"]'))
      .forEach(n => n.parentNode.removeChild(n));
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(this.appInstance);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

test('it replaces the title tag with a meta tag', function(assert) {
  let titleTag = '<title>foo</title>';
  appendHTML(titleTag);
  titleToMeta(document.querySelector('#ember-testing'));
  assert.ok(document.querySelector('meta[name="title-for-ember"][content="foo"]'), 'meta tag is added');
});

test('it does not url encode the title', function(assert) {
  let titleTag = '<title>foo & bar</title>';
  appendHTML(titleTag);
  titleToMeta(document.querySelector('#ember-testing'));
  let metaTag = document.querySelector('meta[name="title-for-ember"]');
  assert.equal(metaTag.getAttribute('content'), 'foo & bar', 'ampersands should not be html entities');
});
