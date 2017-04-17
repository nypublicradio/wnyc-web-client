import Ember from 'ember';

export function decamelizeKeys([ source ]/*, hash*/) {
  let dest = {};
  Object.keys(source).forEach(k => dest[k.decamelize()] = source[k]);
  return dest;
}

export default Ember.Helper.helper(decamelizeKeys);
