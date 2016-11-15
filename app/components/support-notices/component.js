import Component from 'ember-component';
import { or, reads } from 'ember-computed';
import bowser from 'ember-bowser';
import moment from 'moment';

export default Component.extend({
  unsupportedBrowser: or('old.{chrome,firefox,ie,safari,ios}'),
  unsupportedMobileBrowser: reads('old.ios'),
  old: {
    chrome:    bowser.chrome   && !bowser.check({chrome: "15"}),
    firefox:   bowser.firefox  && !bowser.check({firefox: "3.6"}),
    ie:        bowser.msie     && !bowser.check({msie: "11"}),
    safari:    bowser.safari   && !bowser.check({safari: "6.9"}),
    ios:       bowser.ios      && !bowser.check({osversion: "9"}),
  },
  tomorrow: moment().add(1, 'days').toDate(),
  twoWeeks: moment().add(14, 'days').toDate(),
});
