import Ember from 'ember';
import service from 'ember-service/inject';
import config from 'overhaul/config/environment';
import BetaActionsMixin from 'overhaul/mixins/beta-actions';
import { bind } from 'ember-runloop';

var $window = Ember.$(window),
  $document = Ember.$(document);

export default Ember.Component.extend(BetaActionsMixin, {
  session: service(),
  metrics: service(),
  router: service('wnyc-routing'),
  // we load SVGs via the <use> element, which requires the asset loaded
  // on the same domain
  svgURL: config.wnycSvgURL,
  fixedNavOffset: 0,
  classNameBindings: ["fixed-nav"],

  didInsertElement: function() {
    this._super(...arguments);
    if (!this.get("media.isLargeAndUp")) { //only on mobile
      this.set('fixedNavOffset',  this.$('.sitechrome-nav').offset().top); //get default top offset
      $window.on('scroll.fixednav', bind(this, this.checkOffset));
    }
  },
 
  willDestroyElement: function() {
    this._super(...arguments);
    if (!this.get("media.isLargeAndUp")) {
      $window.off('scroll.fixednav');
    }
  },

  checkOffset: function() {
    this.set("fixed-nav", $document.scrollTop() >= this.get('fixedNavOffset') );
  },

  click: function(e){
    if (e.target.tagName === "A"){
      console.log("click event", e);
      //send tracking
      this.get('metrics').trackEvent({
        category: 'WNYC Menu',
        action: "Clicked " + e.text,
      });
      
    }
  },

  actions: {
    routeSearch(val) {
      this.get('router').transitionTo('djangorendered', ['search/'], {"q": val});
    },
    logout() {
      this.get('metrics').trackEvent({
        category: 'WNYC Menu',
        label: 'Clicked Logout',
      });
      this.get('session').invalidate();
    }
  }
});
