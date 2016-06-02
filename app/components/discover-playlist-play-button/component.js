import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames:['rounded-caps-button mod-filled-red'],
  playingText: "Pause",
  pausedText: "Start Listening"
});
