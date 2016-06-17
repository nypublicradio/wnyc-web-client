import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Component.extend({
  classNames:['discover-show'],

  classNameBindings:['isSelected'],

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
