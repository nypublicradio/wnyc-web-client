import Component from '@ember/component';

export default Component.extend({
  classNameBindings:['isSelected'],
  classNames: ['discover-topic', 'discover-topic-bubble'],
  attributeBindings: ['data-category', 'data-action', 'data-label', 'data-label'],
  tagName: 'label'
});
