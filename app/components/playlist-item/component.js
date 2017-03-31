import Ember from 'ember';

export default Ember.Component.extend({
  /* entry comes in as seconds, convert to ms */
  entryLengthMilliseconds: Ember.computed('item.catalogEntry.length', function() {
    return this.get('item.catalogEntry.length') * 1000;
  }),
 
});

