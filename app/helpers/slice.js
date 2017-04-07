import Ember from 'ember';

export function slice([list, start, end]/*, hash*/) {
  return Array.from(list).slice(start, end);
}

export default Ember.Helper.helper(slice);
