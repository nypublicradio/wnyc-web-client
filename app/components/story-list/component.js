import Ember from 'ember';
import service from 'ember-service/inject';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  listRouter: service(),
  tagName: 'section',
  sectionTitle: computed.alias('listRouter.navTitle')
});
