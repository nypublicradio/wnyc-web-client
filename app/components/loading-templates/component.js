import computed from 'ember-computed';
import Component from 'ember-component';
import Ember from 'ember';

export default Component.extend({
  classNames: ['l-full'],
  classNameBindings: ['cssOverrides'],
  attributeBindings: ['style'],
  pageTemplate: computed('type', function() {
    let type = this.get('type');
    return `components/loading-templates/${type}`;
  }),
  cssOverrides: computed('type', function() {
    let type = this.get('type');
    return `${type}-loading`;
  }),
  didRender() {
    if (!Ember.testing) {
      window.scrollTo(0, 0);
    }
  }
});
