import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings:['isSelected'],
  classNames: ['discover-topic discover-topic-bubble'],
  tagName: 'label'
});
