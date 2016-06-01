import Controller from 'ember-controller';

export default Controller.extend({
  actions: {
    navSlugTransition(navSlug) {
      this.transitionToRoute(`${this.channelType}.well`, navSlug);
    }
  }
});
