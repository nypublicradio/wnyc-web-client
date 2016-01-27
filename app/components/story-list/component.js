import Ember from 'ember';
import service from 'ember-service/inject';
import LegacySupport from '../../mixins/legacy-support';

const {
  Component,
  computed
} = Ember;

export default Component.extend(LegacySupport, {
  listRouter: service(),
  tagName: 'section',
  didRender() {
    this.editLinks()
  },
  sectionTitle: computed.alias('listRouter.navTitle')
});
