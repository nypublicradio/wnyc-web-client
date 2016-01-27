import Ember from 'ember';

export default Ember.Helper.helper(function([template, x, y, crop]) {
  function replaceFn(originalString, base, X, Y, CROP, Q, path) {
    // quality is not passed in from the templates, just use 80
    X = x; Y = y; CROP = crop; Q = 99;

    return `${base}/${X}/${Y}/${CROP}/${Q}/${path}`;
  }

  return template.replace(/(.*\/i)\/(%s)\/(%s)\/(%s)\/(%s)\/(.*)/, replaceFn);
});
