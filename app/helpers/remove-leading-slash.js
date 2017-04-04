import Ember from 'ember';

export function removeLeadingSlash([ string ] /*, hash */) {
  if (string.startsWith('/music')){
    string = string.slice(1);
  }
  return string;
}

export default Ember.Helper.helper(removeLeadingSlash);
