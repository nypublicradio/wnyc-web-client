import { /*test,*/ skip } from 'qunit';
import djangoPage from 'overhaul/tests/pages/django-page';
import moduleForAcceptance from 'overhaul/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

skip('visiting /login', function(assert) {
  visit('/login');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

skip('Sign In button is visible at load', function(assert) {
  visit('/login');

  andThen(() => assert.equal(find('a[href*=login]').text().trim(), 'Sign In'));
});

skip('Submitting valid credentials redirects to previous route', function(assert) {
  let page = server.create('django-page', {id: '/foo'});

  djangoPage
    .bootstrap(page)
    .visit(page);

  visit('/login');
  andThen(() => {
    assert.equal(find('a[href*=login]').text().trim(), 'Sign In');
  });
  andThen(() => {
    fillIn('input[name=username]', 'foo');
    fillIn('input[name=password]', 'bar');
    click('button.submit');
  });
  andThen(() => {
    assert.equal(find('[data-test-selector=logout]').text().trim(), 'Sign Out');
    assert.equal(currentURL(), '/foo');
  });
});

skip('Submitting invalid credentials shows error messages', function(assert) {
  visit('/login');
  fillIn('input[name=username]', 'bad');
  fillIn('input[name=password]', 'password');
  click('button.submit');
  andThen(() => {
    assert.equal(find('ul.errorlist').length, 1);
  });
});

skip('Clicking logout hides privileged links', function(assert) {
  server.create('django-page', {id: '/'});
  visit('/login');
  andThen(() => {
    fillIn('input[name=username]', 'foo');
    fillIn('input[name=password]', 'bar');
    click('button.submit');
  });
  andThen(() => {
    assert.equal(find('[data-test-selector=logout]').text().trim(), 'Sign Out');
    assert.equal(currentURL(), '/');
    click('[data-test-selector=logout]');
  });
  andThen(() => {
    assert.equal(find('a[href*=login]').text().trim(), 'Sign In');
  });
});
