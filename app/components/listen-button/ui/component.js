import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  classNames: ['listen-ui'],
  wideTypes: ['blue-boss', 'blue-minion', 'blue-circle', 'red-minion', 'gray-minion'],
  roundTypes: ['blue-hollow', 'white-hollow'],
  playIcon: computed('type', function() {
    let type = get(this, 'type');
    if (get(this, 'wideTypes').includes(type)) {
      return 'play';
    } else if (get(this, 'roundTypes').includes(type)) {
      return 'play-circle';
    } else {
      return 'play-hollow';
    }
  }),
  pauseIcon: computed('type', function() {
    let type = get(this, 'type');
    if (get(this, 'wideTypes').includes(type)) {
      return 'pause';
    } else if (get(this, 'roundTypes').includes(type)) {
      return 'pause-circle';
    } else {
      return 'pause-hollow';
    }
  })
});
