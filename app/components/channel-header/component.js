import Ember from 'ember';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
    classNames: ['channel-header'],
    elementId: 'channel-header',
    subscribeOptions: computed.readOnly('model.podcastLinks'),
    donationOption: computed.readOnly('model.donate'),
    airings: computed.readOnly('model.scheduleSummary')
});
