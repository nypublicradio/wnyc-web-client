import Controller from 'ember-controller';

export default Controller.extend({
  actions: {
    navSlugTransition(page_params) {
      this.transitionToRoute(`${this.channelType}.page`, page_params);
    }
  }
});
