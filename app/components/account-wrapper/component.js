import Ember from 'ember';
import service from 'ember-service/inject';
import { reads } from 'ember-computed';

export default Ember.Component.extend({
  dj:                service(),
  showPlayer:        reads('dj.showPlayer'),
  classNames:        ['account-screen'],
  classNameBindings: ['showPlayer:account-screen--player-open']
});
