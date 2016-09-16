import Route from 'ember-route';
import service from 'ember-service/inject';

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
