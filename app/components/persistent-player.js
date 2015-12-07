import Ember from 'ember';

export default Ember.Component.extend({
  audio: Ember.inject.service(),
  classNames: ['persistent-player']
});
