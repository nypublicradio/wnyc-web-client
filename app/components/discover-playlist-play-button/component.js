import Ember from 'ember';

/* If I could pass a regular button component as a contextual component
   in discover-playlist, we wouldn't need this */

export default Ember.Component.extend({
  tagName: 'button',
  classNames:['rounded-caps-button mod-filled-red']
});
