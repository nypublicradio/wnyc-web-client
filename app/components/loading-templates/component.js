import computed from 'ember-computed';
import Component from 'ember-component';

export default Component.extend({
  classNames: ['l-full'],
  classNameBindings: ['cssOverrides'],
  attributeBindings: ['style'],
  style: 'background-color: white; position: relative;',
  pageTemplate: computed('type', function() {
    let type = this.get('type');
    return `components/loading-templates/${type}`;
  }),
  cssOverrides: computed('type', function() {
    let type = this.get('type');
    return `${type}-loading`;
  }),
});
