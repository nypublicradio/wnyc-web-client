/* jshint node: true */
module.exports = function(/* env */) {
  "use strict";

  // Establishes a two-way relationship by:
  //   1. installing proxy middleware so that /wnyc/foo gets
  //      proxied to http://www.wnyc.org/foo
  //   2. installing a URL rewriter so that 'http://www.wnyc.org/foo'
  //      gets rewritten to http://localhost:4200/foo.
  //
  // URL rewriters get applied to the proxied content, including
  // Location headers in redirects, URLs in CSS, and URLs in HTML.
  this.masquerade('http://www.wnyc.org',                { as: '/wnyc' });
  this.masquerade('http://media.wnyc.org',              { as: '/wnyc-media' });
  this.masquerade('http://cloud.typography.com', { as: '/cloud-typography', headers: { Referer: 'http://www.wnyc.org' } });

  // This establishes a one-way relationship -- it proxies requests
  // forward, but it doesn't create any URL rewriting rule that would
  // apply within the proxied content. However, any content proxied
  // through this rule *is* still subject to rewriters created by
  // other rules.
  this.proxy('http://www.wnyc.org/api',            { as: '/api' });
  this.proxy('http://www.wnyc.org/datanewswidget', { as: '/datanewswidget' });

  // This is the other kind of one-way relationship, in isolation.
  // this.rewrite('http://www.wnyc.org', { to: '/wnyc' });

  // This is a low-level way to setup your own proxy server if you
  // need more direct control. We will still install URL rewriters for
  // you if you use createProxyServer.
  this.proxy(function(app) {
    let url = require('url');
    let proxyServer = this.createProxyServer();
    app.get('/dynamic-script-loader/*', function(req, res) {
      var parsed = url.parse(req.params[0]);
      var origin = parsed.protocol + '//' + parsed.host;
      req.url = parsed.path;
      proxyServer.web(req, res, { target: origin, changeOrigin: true });
    });
  });
};
