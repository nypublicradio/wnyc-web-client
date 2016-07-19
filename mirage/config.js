import config from 'overhaul/config/environment';

// Note for future people: schema.modelName.create() doesn't generate attributes in mirage factories. Create the objects using server.create in default.js (for local dev), or in the test

// Mirage is diabled by default when using --proxy
// In development (without --proxy) and test environments, these handlers will be used

export default function() {
  this.logging = false;
  let baseUrl = config.wnycURL;

  /*------------------------------------------------------------
    legacy (v1) endpoints
  --------------------------------------------------------------*/

  this.get(`${baseUrl}/api/v1/story/:slug`);
  this.get(`${baseUrl}/api/v1/browser_id/`, {success: true});
  this.get(`${baseUrl}/api/v1/list/comments/24/:storyId/`, 'comment');

  this.get(`${baseUrl}/api/v1/discover/topics`, function(schema) {
    let links = schema.discoverTopics.all().models.map(function(t) {
      return {
        url: t.url,
        title: t.title
      };
    });

    return {
      links: links
    };
  });

  this.get(`${baseUrl}/api/v1/make_radio`, function(schema) {
    let stories = schema.discoverStories.all().models;
    return {
      count: stories.length,
      results: stories.map(c => c.attrs)
    };
  });

  this.post(`${config.wnycAccountRoot}/api/v1/listenaction/create/`, () => true);

  this.post(`${config.wnycAccountRoot}/api/v1/listenaction/create/:pk/:action`, () => true);

  this.post(`${baseUrl}/api/v1/analytics/ga/`, {});

  /*------------------------------------------------------------
    transitional (v2) endpoints
  --------------------------------------------------------------*/

  this.get(`${baseUrl}/api/v2/related/:storyId/`, 'story');

  /*------------------------------------------------------------
    JSON:API (v3) endpoints
  --------------------------------------------------------------*/

  this.post(`${baseUrl}/api/v3/listenactions`, function(schema, {requestBody}) {
    let body = JSON.parse(requestBody);
    body.data.id = (Math.random() * 100).toFixed();
    return body;
  });

  this.get(`/api/v3/shows`);
  this.get(`${baseUrl}/api/v3/shows`);
  this.get(`${baseUrl}/api/v3/bucket/:slug`, 'bucket');
  this.get(`${baseUrl}/api/v3/story/detail/:id`, 'story');
  this.get(`${baseUrl}/api/v3/channel/\*id`, 'api-response');

  this.get(`${baseUrl}/api/v3/refresh_playlist`, function(schema) {
    let stories = schema.discoverStories.all().models;
    
    let data = stories.map(s => {
      return {
        type: "Story",
        id: s.id,
        attributes: s
      };
    });

    return {
      data: data
    };
  });

  /*------------------------------------------------------------
    identity management (account) endpoints
  --------------------------------------------------------------*/
  this.get(`${config.wnycAccountRoot}/api/v1/is_logged_in/`, {isAuthenticated: true});
  this.get(`${config.wnycAccountRoot}/comments/security_info/`, {security_hash: 'foo', timestamp: Date.now()});

  this.post(`${config.wnycAccountRoot}/api/v1/accounts/logout/`, {successful_logout: true});
  this.post(`${config.wnycAccountRoot}/api/v1/accounts/login/`, function(schema, request) {
    let params = {};
    request.requestBody.split('&').forEach(p => {
      params[p.split('=')[0]] = p.split('=')[1];
    });
    if (params.username === 'foo' && params.password === 'bar') {
      return {success: true};
    } else {
      let errors = {};
      Object.keys(params).forEach(p => {
        errors[p] = 'This field is required';
      });
      return { errors };
    }
  });

  // Let this one slip by, we've got a http-proxy for it
  this.passthrough(`/api/v1/dynamic-script-loader`);
  this.passthrough(`${baseUrl}/api/v1/dynamic-script-loader`);
  this.passthrough(`${baseUrl}/api/v1/schedule/whats_on_today/\*`);
  this.passthrough('/datanewswidget/**');

  /*------------------------------------------------------------
  ${wnycURL}/* requests. Oddballs without the api namespace
  --------------------------------------------------------------*/

  this.get(`${baseUrl}`, function(schema) {
    let home = schema.djangoPages.find('/');
    return home.attrs.text;
  });

  this.get(`${baseUrl}/\*id`, 'django-page');
}
