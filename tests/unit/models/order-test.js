import Ember from "ember";
import { moduleForModel, test } from "ember-qunit";

moduleForModel("order", "Unit | Model | order", {
  // Specify the other units that are required for this test.
  needs: []
});

test("it exists", function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test("update links to go correct campaigns/domains", function(assert) {
  let model = this.subject();

  Ember.run(function() {
    model.set("fund", "WNYC");
    assert.equal(
      model.get("updateLink"),
      "https://pledge3.wnyc.org/donate/mc-wnyc"
    );
    model.set("fund", "WQXR");
    assert.equal(
      model.get("updateLink"),
      "https://pledge3.wqxr.org/donate/mc-wqxr"
    );
    model.set("fund", "Radiolab");
    assert.equal(
      model.get("updateLink"),
      "https://pledge3.wnyc.org/donate/mc-radiolab"
    );
    model.set("fund", "Freakonomics");
    assert.equal(
      model.get("updateLink"),
      "https://pledge3.wnyc.org/donate/mc-freakonomics"
    );
    model.set("fund", "J. Schwartz");
    assert.equal(
      model.get("updateLink"),
      "https://pledge3.wnyc.org/donate/mc-jschwartz"
    );
  });
});
