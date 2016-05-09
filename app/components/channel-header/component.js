import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  sessionManager: service(),
  classNames: ['channel-header'],
  elementId: 'channel-header',
  subscribeOptions: computed.readOnly('model.podcastLinks'),
  donationOption: computed.readOnly('model.donate'),
  airings: computed.readOnly('model.scheduleSummary')
});
