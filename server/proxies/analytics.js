/* eslint-env node */

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});
  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  app.use('/analytics', function(req, res, next){
    res.send('OK');
  });
};
