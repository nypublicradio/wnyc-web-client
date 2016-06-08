import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';
import { bind } from 'ember-runloop';

var $window = Ember.$(window),
  $document = Ember.$(document);

export default Ember.Component.extend(BetaActionsMixin, {
  session: service(),
  // we load SVGs via the <use> element, which requires the asset loaded
  // on the same domain
  svgURL: config.wnycSvgURL,
  fixedNavOffset: 0,

  didInsertElement: function() {
    this._super(...arguments);
    if (!this.get("media.isMiddleNarrowAndUp")) { //only on mobile
      this.set('fixedNavOffset',  this.$('.sitechrome-nav').offset().top); //get default top offset
      $window.on('scroll.fixednav', bind(this, this.checkOffset));
    }
  },
 
  willDestroyElement: function() {
    this._super(...arguments);
    if (!this.get("media.isMiddleNarrowAndUp")) {
      $window.off('scroll.fixednav');
    }
  },

  checkOffset: function() {
    if ($document.scrollTop() >= this.get('fixedNavOffset') ){
      this.$().addClass("fixedNav");
    } else {
      this.$().removeClass("fixedNav");
    }
  },

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
