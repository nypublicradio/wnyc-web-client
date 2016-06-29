import Component from 'ember-component';
import { readOnly } from 'ember-computed';

export default Component.extend({
  classNames:         ['channel-header'],
  elementId:          'channel-header',
  subscribeOptions:   readOnly('model.podcastLinks'),
  donationOption:     readOnly('model.donate'),
  airings:            readOnly('model.scheduleSummary')
});
