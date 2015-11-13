import Ember from 'ember';
const { $ } = Ember;

$(document).ready(function() {
  document.write = function(string) {
    // TODO: we can capture these and upgrade them to real DOM
    // manipulation. https://github.com/krux/postscribe already exists
    // to solve this problem, but we may not even need that given that
    // we already have our html-parser service.
    console.warn("Ignoring async document write", string);
  };
});
