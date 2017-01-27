import { moduleFor, test } from 'ember-qunit';
import { bind } from 'ember-runloop';

moduleFor('service:google-ads', 'Unit | Service | google ad', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});

test('it pushes a refesh call into the queue', function(assert) {
  window.googletag.cmd = {
    push(fn) {
      fn();
    }
  };
  window.googletag.pubads = function() {
    return {
      refresh() {
        assert.ok('ok refresh was called');
      }
    };
  };
  
  let service = this.subject();
  bind(service, service.refresh)();
    
  window.googletag.cmd = [];
});
