/* jshint node:true */

module.exports = {
  name: 'wnyc-legacy',
  contentFor: function(which, config) {
    if (which === 'head-footer') {
      return "<script>window.wnyc = {};</script>"
    }
  }
}
