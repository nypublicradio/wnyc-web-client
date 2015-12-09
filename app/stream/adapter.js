import DS from 'ember-data';
import Ember from 'ember';
const { Promise } = Ember.RSVP;

import { ApiBridge } from '../lib/okra-bridge';
const { playerController } = ApiBridge;

export default DS.JSONAPIAdapter.extend({
  findRecord(store, type, id/*, snapshot*/) {
    // TODO: unwind the play event from the APiBridge
    ApiBridge.playStream(id);
    return new Promise(resolve => {
      return playerController.then(a => {
        a.once('player:launchingStream', ({attributes}) => {
          resolve(attributes);
        });
      });
    });
  }
});
