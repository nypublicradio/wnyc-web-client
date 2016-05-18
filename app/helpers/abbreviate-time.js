import Ember from 'ember';

export function abbreviateTime(params/*, hash*/) {

  return params[0].replace('seconds', 'sec').replace('minutes', 'min');
}

export default Ember.Helper.helper(abbreviateTime);
