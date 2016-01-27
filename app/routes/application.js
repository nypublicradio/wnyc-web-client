import Ember from 'ember';
import {installBridge} from '../lib/okra-bridge';

export default Ember.Route.extend({
  asyncWriter: Ember.inject.service(),
  legacyLoader: Ember.inject.service(),

  beforeModel() {
    this.get('asyncWriter').install();
    window.WNYC_LEGACY_LOADER = this.get('legacyLoader');
    window.WNYC_LEGACY_LOADER.define('installBridge', installBridge);

    //window.SM2_DEFER = true;
    window.SM2_OPTIONS = {
      bgColor: '#384043', 
      url: '/media/swf/soundmanager2_v297a-20140901'
    };
  },
  actions: {
    loading() {
      if (this.features.isEnabled('django-page-routing')) {
        return true;
      } else {
        return false;
      }
    }
  }
});
