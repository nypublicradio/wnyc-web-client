var proxyPath = '/wnyc';
var makeConfig = require('../../config/environment');

module.exports = function(app, options) {
  var config = makeConfig(options.environment);

  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});

  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    if (config.realWNYCURL) {
      proxyReq.setHeader('Host', config.wnycURL);
    }
  });

  app.use(proxyPath, function(req, res, next){
    proxy.web(req, res, {
      target: config.realWNYCURL || config.wnycURL,
      autoRewrite: true, // rewrites host in redirects
      changeOrigin: true // rewrites host header in requests
    });
  });
};
