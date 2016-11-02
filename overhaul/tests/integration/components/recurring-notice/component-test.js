import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { clearCookies, readCookies } from 'overhaul/tests/helpers/cookie-tools';

moduleForComponent('recurring-notice', 'Integration | Component | recurring notice', {
  integration: true
});

test('it renders', function(assert) {
  clearCookies();
  this.render(hbs`{{recurring-notice name="notice1" class="notice1"}}`);

  assert.equal(this.$('.notice1').length, 1);

  // Template block usage:
  this.render(hbs`
    {{#recurring-notice name="notice2" class="notice2"}}
      template block text
    {{/recurring-notice}}
  `);

  assert.equal(this.$('.notice2').length, 1);
});


test('it displays the notice', function(assert) {
  clearCookies();

  this.render(hbs`
    {{#recurring-notice}}
       This is a test.
    {{/recurring-notice}}
  `);

  assert.equal($('.recurring-notice-message').length, 1);
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

