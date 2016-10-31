import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

moduleForComponent('recurring-notice', 'Integration | Component | recurring notice', {
  integration: true
});

const clearCookies = function() {
  Object.keys(readCookies()).forEach(function(key) {
    deleteCookie(key);
  });
};

const deleteCookie = function(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const readCookies = function() {
  let cookies = {};
  document.cookie.split(';').forEach(function(cookie) {
    let key = cookie.split('=')[0].replace(/^ +/, "");
    let value = cookie.split('=')[1];
    cookies[key] = value;
  });
  return cookies;
};


test('it renders', function(assert) {
  clearCookies();
  this.render(hbs`{{recurring-notice name="notice1"}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#recurring-notice name="notice2"}}
      template block text
    {{/recurring-notice}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});


test('it displays the notice', function(assert) {
  clearCookies();

  this.render(hbs`
    {{#recurring-notice}}
       This is a test.
    {{/recurring-notice}}
  `);

  assert.equal($('.recurring-notice').length, 1);
});


test('it doesnt display the notice if already seen', function(assert) {
  clearCookies();
  document.cookie = 'testnotification-seen=true';

  this.render(hbs`
    {{#recurring-notice name="testnotification"}}
       This is a test.
    {{/recurring-notice}}
  `);

  assert.equal($('.recurring-notice').length, 0);
});


test('it doesnt display the notice if already dismissed', function(assert) {
  clearCookies();
  document.cookie = 'testnotification-dismissed=true';

  this.render(hbs`
    {{#recurring-notice name="testnotification"}}
       This is a test.
    {{/recurring-notice}}
  `);

  assert.equal($('.recurring-notice').length, 0);
});


test('it sets a seen cookie', function(assert) {
  clearCookies();

  let soon = moment().add(5, 'seconds').toDate();
  this.set('showAgain', soon);

  this.render(hbs`
    {{#recurring-notice name="testnotification" showAgain=showAgain}}
       This is a test.
    {{/recurring-notice}}
  `);

  let cookies = readCookies();

  assert.equal(cookies['testnotification-seen'], 'true');
});

test('it hides the notice when you click the dismiss button', function(assert) {
  clearCookies();

  let soon = moment().add(5, 'seconds').toDate();
  this.set('dismissUntil', soon);

  this.render(hbs`
    {{#recurring-notice name="testnotification" dismissUntil=dismissUntil}}
       This is a test.
    {{/recurring-notice}}
  `);

  $('.recurring-notice-close').click();

  assert.equal($('.recurring-notice').length, 0);
});

test('it sets a dismissed cookie when you click the dismiss button', function(assert) {
  clearCookies();

  let soon = moment().add(5, 'seconds').toDate();
  this.set('dismissUntil', soon);

  this.render(hbs`
    {{#recurring-notice name="testnotification" dismissUntil=dismissUntil}}
       This is a test.
    {{/recurring-notice}}
  `);

  $('.recurring-notice-close').click();

  let cookies = readCookies();
  assert.equal(cookies['testnotification-dismissed'], 'true');
});

