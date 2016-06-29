import Component from 'ember-component';
import computed from 'ember-computed';

export default Component.extend({
  classNames: ['listen-ui'],

  playIcon: computed('type', function() {
    switch(this.get('type')) {
      case 'blue-boss':
      case 'blue-minion':
      case 'blue-circle':
      case 'gray-minion':
        return 'play';
      case 'blue-hollow':
      case 'white-hollow':
        return 'play-circle';
    }
  }),
  pauseIcon: computed('type', function() {
    switch(this.get('type')) {
      case 'blue-boss':
      case 'blue-minion':
      case 'blue-circle':
      case 'gray-minion':
        return 'pause';
      case 'blue-hollow':
      case 'white-hollow':
        return 'pause-circle';
    }
  })
});
