import Ember from 'ember';
import service from 'ember-service/inject';

export default Ember.Component.extend({
  metrics: service(),
  comments: Ember.computed('getComments', {
    get() {
      this.set('isLoading', true);
      this.get('getComments')().then(comments => {
        this.set('comments', comments);
      }).finally(() => this.set('isLoading', false));
    },
    set(k,v) { return v; }
  }),

  didInsertElement() {
    if (this.get('isShowingComments')) {
      this.get('element').scrollIntoView();
    }
  },

  commentsCount: Ember.computed('comments.[]', 'story', function() {
    if (this.get('comments')) {
      return this.get('comments.length');
    } else {
      return this.get('story.commentsCount');
    }
  }),

  isShowingForm: Ember.computed({
    get() {
      return this.get('isShowingComments');
    },
    set(k,v) { return v; }
  }),

  isShowingComments: Ember.computed({
    get() {
      var hash = window.location.hash.slice(1).split('&');
      return hash.indexOf('comments') !== -1 || hash.indexOf('commentlist') !== -1;
    },
    set(k,v){ return v; }
  }),

  actions: {
    getComments() {
      if (!this.get('isShowingComments')) {
        let metrics = this.get('metrics');
        let {gaAction:action, gaLabel:label} = this.get('story.analytics');

        metrics.trackEvent({
          category: 'Displayed Comments',
          action,
          label
        });
      }
      this.set('isShowingComments', true);
      this.set('isShowingForm', true);
    },
    saveSuccess() {
      this.set('isShowingForm', false);
      this.set('isSuccess', true);
    }
  }
});
