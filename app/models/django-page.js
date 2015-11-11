import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  htmlParser: Ember.inject.service(),
  text: DS.attr(),

  document: Ember.computed('text', function() {
    return this.get('htmlParser').parse(this.get('text'));
  }),

  title: Ember.computed('document', function() {
    return this.get('document').querySelector('title').innerHTML;
  })
});
