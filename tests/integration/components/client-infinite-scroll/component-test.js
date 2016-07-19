import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import startMirage from 'overhaul/tests/helpers/setup-mirage-for-integration';

moduleForComponent('client-infinite-scroll', 'Integration | Component | client infinite scroll', {
  integration: true,
  beforeEach() {
    startMirage(this.container);
  },
  afterEach() {
    server.shutdown();
  }
});

test('it renders', function(assert) {
  let testShows = server.createList('show', 42);
  this.set("testShows", testShows);

  this.render(hbs`{{client-infinite-scroll shows=testShows}}`);
  
  assert.equal(this.$("li.list-item").length, 10, "ten items in the list to start");
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