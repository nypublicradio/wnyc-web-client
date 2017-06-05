import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  slug: attr(),
  content: attr(),
  pagecontent: Ember.computed('content', function() {
    let text = this.get('content');
    return this.store.createRecord('django-page', { text });
  })
});
