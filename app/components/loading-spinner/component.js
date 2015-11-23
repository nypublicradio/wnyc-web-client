import Ember from 'ember';
import ENV from 'overhaul/config/environment';

export default Ember.Component.extend({
  staticURL: ENV.wnycStaticURL
});
