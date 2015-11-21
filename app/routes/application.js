import Ember from 'ember';

export default Ember.Route.extend({
  asyncWriter: Ember.inject.service(),
  legacyLoader: Ember.inject.service(),

  beforeModel() {
    this.get('asyncWriter').install();
    window.WNYC_LEGACY_LOADER = this.get('legacyLoader');
  }
});
