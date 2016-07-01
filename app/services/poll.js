import Service from 'ember-service';
import { later, cancel } from 'ember-runloop';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

// NOTE: When ember-cli runs tests, it waits for all timers
// (i.e. Ember.later calls) to finish before ending the test
// process. This means tests will never finish if the poll
// service has been started.
//
// Don't call poll.start() in your test environment.
//
// More information: https://github.com/emberjs/ember.js/issues/3008

export default Service.extend({
  interval: 5000,
  onPoll: function() {},
  schedule(fn, interval) {
    return later(this, function() {
      fn.apply(this);
      set(this, 'timer', this.schedule(fn));
    }, interval);
  },
  stop: function() {
    let timer = this.get('timer');
    if (timer) {
      cancel(timer);
    } else {
      console.warn('Attempted to stop polling, but no timer was found. (Was polling started?)');
    }
  },
  start: function() {
    set(this, 'timer', this.schedule(this.get('onPoll')));
  },
  setup: function(onPoll, intervalMs) {
    if (intervalMs <= 1) {
      throw new Error('Polling interval must be greater than 1');
    }
    set(this, 'onPoll', onPoll);
    set(this, 'interval', intervalMs);
  },
  willDestroy: function() {
    let timer = this.get('timer');
    if (timer) {
      this.stop();
    }
  },

  addPoll({interval, callback, label, wait}) {
    if (interval <= 1) {
      throw new Error('Polling interval must be greater than 1');
    }

    let poll = this._schedule(callback, interval);
    let id = Ember.guidFor(poll);
    this._polls.pushObject({label, handle, poll})
  }
});
