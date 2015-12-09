import DS from 'ember-data';
import Ember from 'ember';
const { Promise, all } = Ember.RSVP;

import { ApiBridge } from '../lib/okra-bridge';
const { playerController, playerModel } = ApiBridge;

export default DS.JSONAPIAdapter.extend({
  findRecord(store, type, id/*, snapshot*/) {
    // TODO: unwind the play event from the ApiBridge so we can get audio objects
    // without playing the audio immeidately, i.e. for queues and history
    ApiBridge.playOnDemand(id);
    //

    let story = new Promise(resolve => {
      return playerController.then(a => {
        a.once('player:launchingRemoteFile', ({attributes}) => {
          resolve(attributes);
        });
      });
    });
    let sound = new Promise(resolve => {
      return playerModel.then(p => {
        p.once('change:sound', (bbModel, soundObject) => {
          resolve({ bbModel, soundObject });
        });
      });
    });
    return all([story, sound]);
  }
});
