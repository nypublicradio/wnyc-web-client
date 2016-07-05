import config from 'overhaul/config/environment';
import html from './helpers/django-html';

// Mirage is diabled by default when using --proxy
// In development (without --proxy) and test environments, these handlers will be used

export default function() {
  this.logging = false;
  let baseUrl = config.wnycURL;


  this.get(`${baseUrl}/api/v1/story/:slug`);

  this.get(`${baseUrl}/api/v1/browser_id`, {success: true});

  this.post(`${baseUrl}/api/v1/analytics/ga/`, {});

  this.post(`${baseUrl}/api/v3/listenactions`, function(schema, {requestBody}) {
    let body = JSON.parse(requestBody);
    body.data.id = (Math.random() * 100).toFixed();
    return body;
  });

  this.get(`${baseUrl}/api/v3/shows`);
  this.get(`${baseUrl}/api/v3/bucket/:slug`, function(schema, request) {
    let { slug } = request.params;
    return schema.buckets.where({slug}).models[0];
  });
  this.get(`${baseUrl}/api/v3/story/detail/:id`, function(schema, request) {
    let { id } = request.params;
    let story = schema.stories.find(id);
    if (!story) {
      server.create('story', {id});
      story = schema.stories.find(id);
    }
    return story;
  })

  this.post(`${baseUrl}/account/api/v1/accounts/login/`, function(schema, request) {
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

  this.get(`${baseUrl}/account/api/v1/is_logged_in/`, {isAuthenticated: true});

  this.post(`${baseUrl}/account/api/v1/accounts/logout/`, {successful_logout: true});

  this.get(`${baseUrl}/api/v1/list/comments/24/:storyId/`, 'comment');
  this.get(`${baseUrl}/api/v2/related/:storyId/`, 'story');

  this.get(`${baseUrl}/api/v3/channel/shows/:showId/:navSlug/:pageNumber`, function(schema, request) {
    let { showId, navSlug, pageNumber } = request.params;
    let id = `shows/${showId}/${navSlug}/${pageNumber}`;
    let apiResponse = schema.apiResponses.find(id);

    if (!apiResponse) {
      let type = /^(list|story)/.exec(showId) || [];
      let attrs = { id };
      if (type[0]  === 'list') {
        attrs.teaseList = server.createList('story', 50);
      } else if (type === 'story') {
        attrs.story = server.create('story');
      }
      server.create('api-response', attrs);
      return schema.apiResponses.find(id);
    }
    return apiResponse;
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

  this.get(`${baseUrl}/api/v1/make_radio`, function(schema) {
    let stories = schema.discoverStories.all().models;
    return {
      count: stories.length,
      results: stories.map(c => c.attrs)
    };
  });

  // Let this one slip by, we've got a http-proxy for it
  this.passthrough(`/api/v1/dynamic-script-loader`);
  this.passthrough(`${baseUrl}/api/v1/dynamic-script-loader`);

  this.passthrough(`${baseUrl}/api/v1/schedule/whats_on_today/*`);
  this.passthrough('/datanewswidget/**');


  /*------------------------------------------------------------
  ${wnycURL}/* requests. Oddballs without the api namespace
  --------------------------------------------------------------*/

  this.get(`${baseUrl}/etag`, {id: 'foo'});

  this.get(`${baseUrl}/account/comments/security_info/`, {security_hash: 'foo', timestamp: Date.now()});

  // django-page requests are root-relative;
  this.get('/story/:slug', function(schema, {params: {slug}}) {
    let id = `story/${slug}/`;
    let djangoPage = schema.djangoPages.find(id);
    return djangoPage.attrs.text;
  });

  this.get(`${baseUrl}`, function(schema) {
    let home = schema.djangoPages.find('/');
    return home.attrs.text;
  });

  this.get(`${baseUrl}/*upstream_url`, function(schema, {params, queryParams}) {
    let qp = Object.keys(queryParams).map(p => `${p}=${queryParams[p]}`);
    let { upstream_url } = params;
    let id = `${qp.length ? `${upstream_url}?${qp.join('&')}` : upstream_url}`;

    let djangoPage = schema.djangoPages.find(id);
    //if (!djangoPage) {
    //  djangoPage = server.create('djangoPage', {id});
    //}
    return djangoPage.attrs.text;
  });

}
