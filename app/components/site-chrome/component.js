import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';

export default Ember.Component.extend(BetaActionsMixin, {
  tagName: '',
  session: service(),
  // we load SVGs via the <use> element, which requires the asset loaded
  // on the same domain
  svgURL: config.wnycSvgURL,
  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
