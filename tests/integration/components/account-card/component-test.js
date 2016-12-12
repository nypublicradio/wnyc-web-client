import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('account-card', 'Integration | Component | account card', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{account-card}}`);

  assert.equal(this.$().text().trim(), 'Basic Info');
});

test("it renders the passed in user's info", function(assert) {
  this.set('model', {
    name: 'foo',
    familyName: 'bar',
    username: 'foobar',
    email: 'foo@bar.com'
  });
  this.render(hbs`{{account-card user=model}}`);
  
  assert.deepEqual(this.$('input').map((i, e) => e.value).get(), ['foo bar', 'foobar', 'foo@bar.com', '******']);
});

test('clicking edit calls edit action', function(assert) {
  
  this.set('edit', function() {
    assert.ok('edit was called');
  });
  
  this.render(hbs`{{account-card edit=(action edit)}}`);
  this.$('[data-test-selector="edit-button"]').click();
});
