import Ember from 'ember';

export default Ember.Controller.extend({
  selectedTopics: [],
  hasNotSelectedATopic: Ember.computed.empty('selectedTopics')
});
