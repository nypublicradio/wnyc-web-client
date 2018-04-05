import Component from '@ember/component';

export default Component.extend({
  classNameBindings:['isSelected'],
  classNames: ['discover-topic discover-topic-bubble'],
  tagName: 'label'
});
