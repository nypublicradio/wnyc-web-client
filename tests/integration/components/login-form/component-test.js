import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import LoginForm from 'overhaul/components/login-form/component';

moduleForComponent('login-form', 'Integration | Component | login form', {
  integration: true,
});

test('it renders', function(assert) {
  this.render(hbs`{{login-form}}`);

  assert.equal(this.$('#login-register').length, 1);
});

test('it passes user and password to login on form submit', function(assert) {
  LoginForm.reopen({
    actions: {
      login() {
        let { username, password } = this.getProperties('username', 'password');
        assert.equal(username, 'foo');
        assert.equal(password, 'bar');
      }
    }
  });

  this.render(hbs`{{login-form}}`);

  this.$('[name=username]').val('foo').trigger('keyup');
  this.$('[name=password]').val('bar').trigger('keyup');

  this.$('button').click();
});
