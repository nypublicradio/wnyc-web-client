import Ember from 'ember';

export default Ember.Component.extend({
  tagName       : '',

  showTitle     : null,
  showUrl       : null,
  showUrlTarget : '',

  storyTitle    : null,
  storyUrl      : null,
  storyUrlTarget: '',

  audioId       : null,
  songDetails   : null
});
