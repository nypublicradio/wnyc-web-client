import config from 'wnyc-web-client/config/environment';
import { Response } from 'ember-cli-mirage';

// Mirage is diabled by default when using --proxy
// In development (without --proxy) and test environments, these handlers will be used

// Note for future people: schema.modelName.create() doesn't generate attributes in mirage factories. Create the objects using server.create in default.js (for local dev), or in the test

export default function() {
  this.logging = false;
  let baseUrl = config.wnycURL;

  /*------------------------------------------------------------
    legacy (v1) endpoints
  --------------------------------------------------------------*/

  this.get(`${baseUrl}/api/v1/story/:id`);
  this.get(`${baseUrl}/api/v1/browser_id/`, {success: true});
  this.get(`${baseUrl}/api/v1/list/comments/24/:storyId/`, 'comment');
  this.get(`${baseUrl}/api/v1/whats_on/`);
  this.get('/api/v1/whats_on/');
  this.get(`${baseUrl}/api/v1/whats_on/:slug`, 'whats-on');
  this.get('/api/v1/whats_on/:slug', 'whats-on');
  this.get(`${baseUrl}/api/v1/list/streams/`);
  this.get('/api/v1/list/streams/');
  this.get(`${baseUrl}/api/v1/list/streams/:slug`, 'stream');
  this.get('/api/v1/list/streams/:slug', 'stream');

  this.get(`/api/v1/story/:slug`, function(schema, request) { // backbone makes this ajax request to the audio
    let results = schema.discoverStories.all().models.filter(function(d) {
      return d.id === request.params.slug;
    });

    return {
      count: 1,
      expires:  "2020-06-10T14:10:32",
      results: results
    };
  });

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

  let discoverPath = config.featureFlags['other-discover'] ? 'reco_proxy' : 'make_playlist';
  this.get(`${baseUrl}/api/v3/${discoverPath}`, function(schema) {
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
  this.get(`${config.wnycAccountRoot}/api/v1/is_logged_in/`, {});
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

  this.post(`${config.wnycAccountRoot}/api/v1/listenaction/create/`, () => true);

  this.post(`${config.wnycAccountRoot}/api/v1/listenaction/create/:pk/:action`, () => true);

  this.post(`${config.wnycAccountRoot}/api/most/view/managed_item/:id`, () => true);

  this.post(`${config.wnycAccountRoot}/api/v1/analytics/ga`, () => true);

  /*------------------------------------------------------------
    passthroughs
  --------------------------------------------------------------*/

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
    return home ? home.attrs.text : '';
  });

  this.get(`${baseUrl}/\*id`, function(schema, {queryParams, params}) {
    let { id } = params;
    let page = schema.djangoPages.find(id);
    if (!page) {
      // try with queryParams
      id += '?' + Object.keys(queryParams)
        .map(p => `${p}=${queryParams[p]}`).join('&');
      page = schema.djangoPages.find(id);
    }
    return page || new Response(404);
  });
  
  /*-------------------------------------------------------------
  auth microservice
  ---------------------------------------------------------------*/
  
  this.urlPrefix = config.wnycAuthAPI;
  
  this.post('/v1/password', {});
  
  this.get('/v1/session', (schema, request) => {
    if (!request.requestHeaders.Authorization) {
      return new Response(401);
    }
    return schema.users.first();
  });
  this.post('/v1/session', {access_token: 'secret', expires_in: 3600, token_type: 'bearer'});
  this.put('/v1/session', {access_token: 'secret', expires_in: 3600, token_type: 'bearer'});
  this.delete('/v1/session', {});
  
  this.post('/v1/user', {});
  this.patch('/v1/user', (schema, request) => {
    if (!request.requestHeaders.Authorization) {
      return new Response(401);
    }
    let user = schema.users.first();
    if (!user) {
      return new Response(500, {error: {code: 'BadTest', message: 'No users found'}});
    }
    return user.update(JSON.parse(request.requestBody));
  });
  this.delete('/v1/user', () => new Response(204));
  this.get('/v1/user/exists-by-attribute', {username: ''});
  
}
