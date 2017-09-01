import Ember from 'ember';


export default Ember.Controller.extend({
  queryParams:  ['tab'],
  tab: 'summary',
  metrics: Ember.inject.service(),
  setTab(){
    if (location.hash.substr(1) === "transcript"){
        this.set("tab", 'transcript');
      }
  },

  init(){
    this._super(...arguments);
    Ember.run.scheduleOnce("afterRender", this, this.setTab);
  },

  actions: {
    onShowComments(story) {
      let metrics = this.get('metrics');
      let {containers:action, title:label} = story.get('analytics');

      metrics.trackEvent('GoogleAnalytics', {
        category: 'Displayed Comments',
        action,
        label
      });
    }
  }
});
