import Ember from 'ember';
import ENV from 'wnyc-wrapper/config/environment';

export default Ember.Component.extend({
  staticURL: ENV.wnycStaticURL
});
