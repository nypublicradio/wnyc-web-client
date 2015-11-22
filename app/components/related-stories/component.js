import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['list', 'list--noborder'],
  pathname: document.location.pathname,

  stories: Ember.computed('getStories', {
    get() {
      this.get('getStories')().then(stories => {
        this.set('stories', stories);
        Ember.run.scheduleOnce('afterRender', this, this.imagesLoaded)
      });
    },
    set(k,v) { return v; }
  }),

  imagesLoaded() {
    // here we are, promise fulfilled, DOM rendered, so let's register this
    // call back to run once all the <img/> els are finished downloading
    this.$().imagesLoaded()
      .progress(function(instance, image) {
        Ember.$(image.img).addClass('is-loaded')
      })
  }
})
