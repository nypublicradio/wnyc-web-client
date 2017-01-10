/*jshint node:true*/

/*
  This allows Ember to coexist with other badly-behaved AMD loaders by
  hiding Ember's module loader inside the WNYC_EMBER_LOADER global.
*/

var concat = require('broccoli-sourcemap-concat');
var merge = require('broccoli-merge-trees');

module.exports = {
  name: 'unobtrusive-loader',

  isDevelopingAddon: function() {
    return true;
  },

  postprocessTree: function(type, tree) {
    if(type === 'all' && this.app.env !== 'test') {
      return merge([
        tree,
        concat(tree, {
          header: 'var WNYC_EMBER_LOADER=(function(){',
          inputFiles: ['assets/vendor.js'],
          footer: '; return { define:define,require:require,requireModule:requireModule,requirejs:requirejs, runningTests: runningTests };})();',
          outputFile: 'assets/vendor.js'
        }),
        concat(tree, {
          header: '(function(define, require, requireModule, requirejs, runningTests){ ',
          inputFiles: ['assets/wnyc-web-client.js'],
          footer: '})(WNYC_EMBER_LOADER.define, WNYC_EMBER_LOADER.require, WNYC_EMBER_LOADER.requireModule, WNYC_EMBER_LOADER.requirejs, WNYC_EMBER_LOADER.runningTests);',
          outputFile: 'assets/wnyc-web-client.js'
        })
      ], { overwrite: true });
    } else {
      return tree;
    }
  }

};
