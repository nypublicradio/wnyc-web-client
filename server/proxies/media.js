/* eslint-env node */
var proxyPath = '/media';

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});
  proxy.on('error', function(err, req, res) {
    console.error(err, req.url);
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(err.Error);
  });

  app.use(proxyPath, function(req, res/*, next*/){
    req.url = proxyPath + '/' + req.url;
    proxy.web(req, res, { target: `${process.env.PUBLISHER_API}` });
  });
};
