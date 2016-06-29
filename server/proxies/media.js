/*jshint node:true*/
var proxyPath = '/media';

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});
  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  app.use(proxyPath, function(req, res, next){
    req.url = proxyPath + '/' + req.url;
    proxy.web(req, res, { target: `${process.env.WNYC_API}` });
  });
};
