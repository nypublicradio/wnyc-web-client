import Ember from 'ember';

export function camelizeKeys([ source ]/*, hash*/) {
  let dest = {};
  Object.keys(source).forEach(k => dest[k.camelize()] = source[k]);
  return dest;
}

export default Ember.Helper.helper(camelizeKeys);
