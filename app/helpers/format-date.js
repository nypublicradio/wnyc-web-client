/*global moment*/
import Ember from 'ember';
const {
  helper
} = Ember.Helper

export default helper(function([ date, format ]) {
   return moment(new Date(date)).format(format);
});
