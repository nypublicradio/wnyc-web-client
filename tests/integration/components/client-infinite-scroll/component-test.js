import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'wqxr-web-client/tests/helpers/setup-mirage-for-integration';

module('Integration | Component | client infinite scroll', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    startMirage(this.container);
  });

  hooks.afterEach(function() {
    server.shutdown();
  });

  test('it renders', async function(assert) {
    let testShows = server.createList('show', 42);
    this.set("testShows", testShows);

    await render(hbs`{{client-infinite-scroll shows=testShows}}`);
    
    assert.equal(findAll("li.list-item").length, 10, "ten items in the list to start");
  });

  // test('it adds more items on scroll', function(assert) {
  //   let testShows = server.createList('show', 53);
  //   this.set("testShows", testShows);

  //   this.render(hbs`{{client-infinite-scroll shows=testShows}}`);

  //   assert.equal(this.$("li.list-item").length, 10, "ten items in the list to start");

  //   //var done = assert.async();
  //   $("#ember-testing-container").scrollTop(1000);
  //   $("#ember-testing-container").trigger("scroll");
  //   assert.equal(this.$(".loading-spinner").length, 1, "loading spinner is present");

  //   setTimeout(function() {
  //     assert.equal(this.$("li.list-item").length, 20, "items added on scroll");
  //   }, 1000);


  // });
});