import Component from '@ember/component';
import computed from 'ember-computed';

export default Component.extend({
  classNames:['discover-show'],

  classNameBindings:['isSelected'],
  attributeBindings:['slug:data-slug'],

  imageUrl: computed('imageTemplate', function() {
    let template = this.get('imageTemplate');
    if (template) {
      return template.replace('%s/%s/%s/%s', "200/200/l/80");
    }
  }),

  click() {
    this.toggleProperty('isSelected');
  }
});
