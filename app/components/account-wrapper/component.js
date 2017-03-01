import Ember from 'ember';
import service from 'ember-service/inject';
import { and, not } from 'ember-computed';

export default Ember.Component.extend({
  audio:             service(),
  noErrors:          not('audio.hasErrors'),
  showPlayer:        and('noErrors', 'audio.playedOnce'),
  classNames:        ['account-screen'],
  classNameBindings: ['showPlayer:account-screen--player-open']
});
