/*jshint node:true*/
var streamPath = '/api/v1/list/streams/(.*/)?';
var whatsOnPath = '/api/v1/whats_on/(.*/)?';

module.exports = function(app) {
  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});

  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  app.use(streamPath, function(req, res, next){
    proxy.web(req, res, { target: 'http://api.wnyc.org/api/v1/list/streams/' });
  });
  
  app.use(whatsOnPath, function(req, res) {
    proxy.web(req, res, { target: 'http://api.wnyc.org/api/v1/whats_on/' });
  });
};
