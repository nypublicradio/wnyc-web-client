import Component from 'ember-component';
import service from 'ember-service/inject';

export default Component.extend({
  currentUser: service(),
  tagName: 'section',
});
