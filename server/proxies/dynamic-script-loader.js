/*jshint node:true*/
var proxyPath = '/dynamicScriptLoader';
var url = require('url');

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});

  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  app.get('/dynamic-script-loader/*', function(req, res) {
    var parsed = url.parse(req.params[0]);
    var origin = parsed.protocol + '//' + parsed.host;
    req.url = parsed.path;
    proxy.web(req, res, { target: origin, changeOrigin: true });
  });
};
