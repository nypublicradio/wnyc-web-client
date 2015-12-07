import Ember from 'ember';
import {playOnDemand} from '../lib/okra-bridge';
import Bridge from '../lib/okra-bridge';

export default Ember.Service.extend({
  bridge: Bridge.create(),
  position: Ember.computed.alias('bridge.position'),
  isPlaying: Ember.computed.bool('bridge.isPlaying'),
  playOnDemand(pk) {
    playOnDemand(pk);
  }
});
