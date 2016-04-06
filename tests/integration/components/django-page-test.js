import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { faker  } from 'ember-cli-mirage';
import Ember from 'ember';

const { getOwner  } = Ember;

let featuresService = Ember.Service.extend({
  features: {},
  isEnabled(feature) {
    let features = this.get('features');
    return features[feature];
  },
  enable(feature) {
    let features = this.get('features');
    features[feature] = true;
  },
  disable(feature) {
    let features = this.get('features');
    features[feature] = false;
  },
  disableAll() {
    this.set('features', {});
  }
});

let store;

function createDjangoPage(attrs) {
  let testDjangoPage = Ember.run(() => {
    return store.createRecord('django-page', attrs);
  });
  return testDjangoPage;
}

moduleForComponent('django-page', 'Integration | Component | django page', {
  integration: true,
  beforeEach() {
    store = this.container.lookup('service:store');
    this.register('service:features', featuresService);
    getOwner(this).inject('component', 'features', 'service:features');
  },
  afterEach() {
    let featureFlags = this.container.lookup('service:features');
    featuresFlags.disableAll();
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{django-page}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#django-page showingOverlay=true}}
      template block text
    {{/django-page}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('let # links pass through', function(assert) {
  this.render(hbs`
    {{#django-page showingOverlay=true}}
      <a href="#" id="link">click</a><div id="output"></div>
    {{/django-page}}
  `);

  document.addEventListener('click', function bar(e) {
    if (e.target.id === 'link') {
      e.preventDefault();
      let output = document.getElementById('output');
      output.textContent = 'foo';
    }
    document.removeEventListener('click', bar);
  }, false);

  document.querySelector('#link').click();

  assert.equal(this.$('#output').text(), 'foo');
  assert.notOk(location.hash);
});

test('imagesLoaded callback is fired on image elements within django-rendered HTML', function(assert) {
  assert.expect(1);
  let done = assert.async();

  let djangoHTML = `<img id="test" src="${faker.internet.avatar()}">`;

  this.set('page', createDjangoPage({ text: djangoHTML }));

  this.render(hbs`{{django-page page=page}}`);

  Ember.run.later(this, function() {
    this.$().imagesLoaded(() => {
      assert.ok(this.$('#test').hasClass('is-loaded'));
      done();
    });
  }, 1000);
});

