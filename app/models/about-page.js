import DS from 'ember-data';
import Ember from 'ember';
const { computed, get } = Ember;

export default DS.Model.extend({
  body: DS.attr('string'),
  people: DS.attr(),
  social: DS.attr(),
  escapedBody: computed('body', {
    get() {
      let body = get(this, 'body');
      return body.replace(/\\x3C\/script>/g, '</script>');
    }
  }),
});
