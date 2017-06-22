import Ember from 'ember';

export function camelizeObj(source) {
  let dest = null;

  if (Array.isArray(source)) {
    dest = source.map(function(obj){
      return camelizeObj(obj);
    });
  } else if (source !== null && typeof source === "object") {
    dest = {};
    for (var prop in source){
      let newKey = prop.camelize();
      dest[newKey] = camelizeObj(source[prop]);
    } 
  } else {
    dest = source;
  }

  return dest;
}

export default Ember.Helper.helper(camelizeObj);