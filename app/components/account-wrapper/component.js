import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  dj:                service(),
  showPlayer:        reads('dj.showPlayer'),
  classNames:        ['account-screen'],
  classNameBindings: ['showPlayer:account-screen--player-open']
});
