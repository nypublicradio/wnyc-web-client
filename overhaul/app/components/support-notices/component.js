import Component from 'ember-component';
import { or, reads } from 'ember-computed';
import bowser from 'ember-bowser';
import moment from 'moment';

export default Component.extend({
  unsupportedBrowser: or('old.{chrome,firefox,ie,safari,mobileSafari}'),
  unsupportedMobileBrowser: reads('old.mobileSafari'),
  old: {
    chrome:    bowser.chrome   && bowser.version < 15,
    firefox:   bowser.firefox  && bowser.version < 3.6,
    ie:        bowser.msie     && bowser.version < 11,
    safari:    bowser.safari   && bowser.version < 6.9,
    mobileSafari: bowser.ios && bowser.safari && bowser.osversion < 9,
  },
  tomorrow: moment().add(1, 'days').toDate(),
  twoWeeks: moment().add(14, 'days').toDate(),
});
