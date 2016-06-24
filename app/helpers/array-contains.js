import Ember from 'ember';

export function arrayContains(params/*, hash*/) {
  let a = params[0];
  return a.contains(params[1]);
}

export default Ember.Helper.helper(arrayContains);
