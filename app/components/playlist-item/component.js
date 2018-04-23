import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  /* entry comes in as seconds, convert to ms */
  entryLengthMilliseconds: computed('item.catalogEntry.length', function() {
    return this.get('item.catalogEntry.length') * 1000;
  }),
 
});

