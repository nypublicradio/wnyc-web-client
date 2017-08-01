import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams:  ['tab'],
  tab: 'summary',

  setTab(){
    if (location.hash.substr(1) === "transcript"){
        this.set("tab", 'transcript');
      }
  },

  init(){
    this._super(...arguments);
    Ember.run.scheduleOnce("afterRender", this, this.setTab);
  }
});