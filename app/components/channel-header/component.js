import Component from 'ember-component';
import { readOnly } from 'ember-computed';
import config from 'overhaul/config/environment';

export default Component.extend({
  classNames:         ['channel-header'],
  elementId:          'channel-header',
  adminURL:           config.wnycAdminURL,

  subscribeOptions:   readOnly('model.podcastLinks'),
  donationOption:     readOnly('model.donate'),
  airings:            readOnly('model.scheduleSummary')
});
