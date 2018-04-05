import Route from 'ember-route';
import { inject as service } from '@ember/service';

export default Route.extend({
  discoverPrefs: service(),
  
  redirect(/*model, transition*/) {
    let prefs = this.get('discoverPrefs');
    
    if (!prefs.get('setupComplete')) {
      this.replaceWith(`discover.${prefs.get('currentSetupStep')}`);
    } else {
      this.replaceWith('discover.index');
    }
  }
});
