var proxyPath = '/cloud-typography';
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
    proxyReq.setHeader('Referer', 'http://www.wnyc.org');
  });

  proxy.on('proxyRes', function(proxyRes, req, res) {
    var writeHead = res.writeHead;
    res.writeHead = function() {
      var location = res.getHeader('location');
      if (location) {
        res.setHeader('location', location.replace(/https?:\/\/media.wnyc.org/, '/wnyc-media'));
      }
      writeHead.apply(this, arguments);
    };
  });

  app.use(proxyPath, function(req, res, next){
    proxy.web(req, res, {
      target: 'http://cloud.typography.com',
      hostRewrite: 'localhost:4200', // rewrites Location in redirects
      changeOrigin: true // rewrites host header in requests
    });
  });
};
