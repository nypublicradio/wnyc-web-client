import Ember from 'ember';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  audio: service(),
  classNames: ['persistent-player']
});
