var proxyPath = '/wnyc-media';
var makeConfig = require('../../config/environment');
var zlib = require('zlib');

module.exports = function(app, options) {
  var config = makeConfig(options.environment);

  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  var proxy = require('http-proxy').createProxyServer({});

  proxy.on('error', function(err, req) {
    console.error(err, req.url);
  });

  proxy.on('proxyRes', rewrite({
    'text/css': function(data){
      return data.replace(/(url\(['"]?)([^)]+)(['"]?\))/g, function(m, prefix, url, suffix){
        return prefix + url.replace(/^\/\/?/, proxyPath + '/') + suffix;
      });
    }
  }));


  app.use(proxyPath, function(req, res, next){
    proxy.web(req, res, {
      target: config.wnycMediaURL,
      autoRewrite: true, // rewrites Location in redirects
      changeOrigin: true // rewrites host header in requests
    });
  });
};

function rewrite(definition) {
  return function(proxyRes, req, res) {
    if(!proxyRes.headers) { return; }
    var applyRewrite = definition[proxyRes.headers[ 'content-type' ]];
    if (!applyRewrite) { return; }

    var realWrite = res.write;
    var realEnd = res.end;
    var encoding = proxyRes.headers['content-encoding'];
    var gunzip, gzip;

    if (encoding && encoding.toLowerCase() === 'gzip') {
      gunzip = zlib.Gunzip();
      gunzip.on('data', function(buf) {
        if (buf) {
          buf = new Buffer(applyRewrite(buf.toString('utf8')), 'utf8');
        }
        gzip.write(buf);
      });
      gunzip.on('end', function(data) {
        gzip.end(data);
      });
      gzip = zlib.Gzip();
      gzip.on('data', function(buf) {
        realWrite.call(res, buf);
      });
      gzip.on('end', function(data) {
        realEnd.call(res, data);
      });
    }

    res.write = function(data) {
      if (gunzip) {
        gunzip.write(data);
      } else {
        if (data) {
          data = new Buffer(applyRewrite(data.toString('utf8')), 'utf8');
        }
        realWrite.call(res, data);
      }
    };

    res.end = function(data, encoding) {
      if (gunzip) {
        gunzip.end(data);
      } else {
        realEnd.call(res, data, encoding);
      }
    };
  };
}
