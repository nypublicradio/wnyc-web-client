import Ember from 'ember';

const {
  Component,
} = Ember;

export default Component.extend({
  classNames: ['setting-queuefinish'],
  tagName: 'div',
  currentActionCaption: "start playing WNYC FM",
  finishLinks: [{
    title: "Start playing WNYC FM",
    href:"#",
    action: function() {}
  },{
    title: "Start playing WNYC AM",
    href:"#",
    action: function() {}
  },{
    title: "Just stop playing",
    href:"#",
    action: function() {}
  }]
});
