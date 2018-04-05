import { module, test } from 'qunit';
import { setupTest } from "ember-qunit";

import { run } from '@ember/runloop';

module("Unit | Model | order", function(hooks) {
  setupTest(hooks);

  test("it exists", function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('order'));
    // let store = this.store();
    assert.ok(!!model);
  });

  test("update links to go correct campaigns/domains", function(assert) {
    let model = run(() => this.owner.lookup('service:store').createRecord('order'));

    run(function() {
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
});
