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

  app.get('/api/v1/dynamic-script-loader/', function(req, res) {
    var query = url.parse(req.url, true).query;
    var parsed = url.parse(query.url);
    var origin = parsed.protocol + '//' + parsed.host;
    req.url = parsed.path;
    res.setHeader('Access-Control-Allow-Origin', '*');
    proxy.web(req, res, { target: origin, changeOrigin: true });
  });
};
