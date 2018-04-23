import config from 'wqxr-web-client/config/environment';
import { Response, faker } from 'ember-cli-mirage';
import { get } from '@ember/object';

// Mirage is diabled by default when using --proxy
// In development (without --proxy) and test environments, these handlers will be used

// Note for future people: schema.modelName.create() doesn't generate attributes in mirage factories. Create the objects using server.create in default.js (for local dev), or in the test
const getPropertyCaseInsensitive = function(obj, prop) {
  prop = prop.toLowerCase();
  for (let p in obj) {
    if (obj.hasOwnProperty(p) && prop === p.toLowerCase()) {
      return obj[p];
    }
  }
  return undefined;
};
const hasAuthToken = function(request) {
  let authToken = getPropertyCaseInsensitive(request.requestHeaders, 'Authorization');
  return /bearer \w+/i.test(authToken);
};
const hasProvider = function(request) {
  let providerHeader = getPropertyCaseInsensitive(request.requestHeaders, 'X-Provider');
  return (providerHeader !== undefined);
};

export default function() {
  this.logging = false;

  /*------------------------------------------------------------
    legacy (v1) endpoints
  --------------------------------------------------------------*/

  this.urlPrefix = config.publisherAPI;

  this.get('/v1/story/:id');
  this.get('/v1/list/comments/24/:storyId/', 'comment');
  this.get('/v1/whats_on/');
  this.get('/v1/whats_on/:slug', 'whats-on');
  this.get('/v1/list/streams/');
  this.get('/v1/list/streams/:slug', 'stream');

  this.post('/v1/listenaction/create/:id/play/', {});
  this.post('/v1/listenaction/create/:id/complete/', {});
  this.post('/most/view/managed_item/:id/', {});
  this.post('/most/listen/managed_item/:id/', {});

  this.get('/v1/browser_id/', {success: true});

  /*------------------------------------------------------------
    transitional (v2) endpoints
  --------------------------------------------------------------*/

  this.get('/v2/related/:storyId/', 'story');

  /*------------------------------------------------------------
    JSON:API (v3) endpoints
  --------------------------------------------------------------*/

  this.get('/v3/shows');
  this.get('/v3/buckets/:slug/', ({ buckets }, { params }) => {
    return buckets.findBy({ slug: params.slug });
  })

  this.get('/v3/story-pk/:id/', 'story');
  this.get('/v3/story/:slug/', ({ stories }, { params }) => {
    let { slug } = params;
    return stories.where({ slug }).models[0];
  });
  this.get('/v3/story/related/', 'story');
  this.get('/v3/channel/*id', ({ apiResponses, listingPages }, { params }) => {
    let { id } = params;
    if (id.split('/').length === 2) {
      // listing-page
      return listingPages.find(id);
    } else {
      // api response object
      return apiResponses.find(id);
    }
  });
  this.get('/v3/chunks/:id/', 'chunk');

  /*------------------------------------------------------------
    identity management (account) endpoints
  --------------------------------------------------------------*/
  this.urlPrefix = config.adminRoot;

  this.get('/comments/security_info/', {security_hash: 'foo', timestamp: Date.now()});
  this.get('/api/v1/is_logged_in/', {});
  this.post('/api/v1/accounts/logout/', {successful_logout: true});
  this.post('/api/v1/accounts/login/', function(schema, request) {
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

  /*------------------------------------------------------------
    passthroughs
  --------------------------------------------------------------*/

  this.urlPrefix = ''

  // Let this one slip by, we've got a http-proxy for it
  this.passthrough('/api/v1/dynamic-script-loader');
  this.passthrough(`${config.publisherAPI}/api/v1/dynamic-script-loader`);
  this.passthrough(`${config.publisherAPI}/api/v1/schedule/whats_on_today/*`);
  this.passthrough('/datanewswidget/**');

  /*------------------------------------------------------------
  ${webRoot}/* requests. Oddballs without the api namespace
  --------------------------------------------------------------*/

  this.get(`${config.webRoot}`, function(schema) {
    let home = schema.djangoPages.find('/');
    return home ? home.attrs.text : '';
  });

  this.get(`${config.webRoot}/*id`, function(schema, {queryParams, params}) {
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

  this.urlPrefix = config.authAPI;

  this.post('/v1/password', {});

  this.get('/v1/session', ({users}, request) => {
    if (!request.requestHeaders.Authorization && !request.requestHeaders.authorization) {
      return new Response(401);
    }

    return users.first();
  });
  this.post('/v1/session', {access_token: 'secret', expires_in: 3600, token_type: 'bearer'});
  this.put('/v1/session', {access_token: 'secret', expires_in: 3600, token_type: 'bearer'});
  this.delete('/v1/session', {});

  this.post('/v1/user', ({users}, request) => {
    let body = JSON.parse(request.requestBody);
    if (request.requestHeaders['X-Provider']) {
      let fbUser = users.create({
        email: body.email || faker.internet.email(),
        given_name: body.given_name || faker.name.firstName(),
        family_name: body.family_name || faker.name.lastName(),
        preferred_username: body.preferred_username || faker.name.firstName() + faker.name.firstName(),
        facebook_id: body.facebook_id,
        picture: body.picture
      });

      return fbUser;
    }
    return users.first();
  });
  this.patch('/v1/user', (schema, request) => {
    if (!request.requestHeaders.Authorization && !request.requestHeaders.authorization) {
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

  let userNotFoundException = {
    "errors": {
      "code": "UserNotFoundException",
      "message": "Username/client id combination not found.",
      "values": ["email"]
    }
  };

  this.get('/v1/confirm/sign-up', (schema, request) => {
    if (!request.queryParams.username || request.queryParams.username === "null") {
      return new Response(400, {}, userNotFoundException);
    } else {
      return new Response(200);
    }
  });

  let expiredCodeException = {
    "errors": {
      "code": "ExpiredCodeException",
      "message": "Invalid code provided, please request a code again.",
      "values": ["email"]
    }
  };

  this.post('/v1/confirm/password-reset', (schema, request) => {
    let params = JSON.parse(request.requestBody);
    if (!params.confirmation || params.confirmation === "null") {
      return new Response(400, {}, expiredCodeException);
    } else {
      return new Response(200);
    }
  });

  let unauthorizedAccessException = {
    "errors": {
      "code": "UnauthorizedAccess",
      "message": "User account has expired, it must be reset by an administrator."
    }
  };

  this.post('/v1/password/change-temp', (schema, request) => {
    let params = JSON.parse(request.requestBody);
    if (!params.temp || params.temp === "expired") {
      return new Response(401, {}, unauthorizedAccessException);
    } else {
      return new Response(200);
    }
  });

  this.post('/v1/password/send-temp', (schema, request) => {
    if (!request.requestHeaders.Authorization && !request.requestHeaders.authorization) {
      return new Response(401);
    }
    return new Response(200);
  });

  this.get('/v1/confirm/resend-attr', (schema, request) => {
    if (hasAuthToken(request) && !hasProvider(request)) {
      return new Response(200);
    } else {
      return new Response(401);
    }
  });

  /*-------------------------------------------------------------
  analytics microservice
  ---------------------------------------------------------------*/

  this.urlPrefix = config.platformEventsAPI;

  this.post('/v1/events/viewed', {});
  this.post('/v1/events/listened', {});

  /*-------------------------------------------------------------
  membership microservice
  ---------------------------------------------------------------*/
  this.urlPrefix = config.membershipAPI;

  this.get('/v1/orders/', 'orders');
  this.get('/v1/emails/is-verified/', {data: {is_verified: true}});
  this.patch('/v1/emails/:email_id/verify/', (schema, request) => {
    let params = JSON.parse(request.requestBody);
    if (params &&
        get(params, 'data.attributes.verification_token') &&
        get(params, 'data.attributes.verification_token') !== "null") {
      return new Response(200, {}, {data: {success: true}});
    } else {
      return new Response(200, {}, {data: {success: false}});
    }
  });
}
