import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams:  ['tab'],
  tab: 'summary',

  // init(){
  //   this._super(...arguments);
  //   if (location.hash.substr(1) === "transcript"){
  //     this.set("tab", 'transcript');
  //   }
  // }
});