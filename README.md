# WNYC Web Client
[![CircleCI](https://img.shields.io/circleci/project/github/nypublicradio/wnyc-web-client/main.svg?style=flat-square)](https://circleci.com/gh/nypublicradio/wnyc-web-client/tree/main) [![GitHub release](https://img.shields.io/github/release/nypublicradio/wnyc-web-client.svg?style=flat-square)](https://github.com/nypublicradio/wnyc-web-client/releases/latest) [![GitHub pull requests](https://img.shields.io/github/issues-pr/nypublicradio/wnyc-web-client.svg?style=flat-square)](https://github.com/nypublicradio/wnyc-web-client/pulls) [![GitHub contributors](https://img.shields.io/github/contributors/nypublicradio/wnyc-web-client.svg?style=flat-square)](https://github.com/nypublicradio/wnyc-web-client/graphs/contributors) 

This is a browser-based client for interfacing with the New York Public Radio digital infrastructure.  This Ember application renders all of www.wnyc.org using the preexisting Django server as a backend data source, consuming HTML documents and JSON payloads to present a dynamic interface. This gives us the benefits of a persistent in-browser application while still using the existing content and infrastructure.

## Getting Started

This ember app is a **client**, which means its primary purpose is to provide an interface to data source. On its own, this application will not do much without some kind of source from which it can retrieve content to display. To this end, you will need to either use the *demo* instance of Publisher at internal.demo2.wnyc.net or run a checkout of [`publisher`](https://github.com/nypublicradio/publisher) as a **server** locally.

`publisher` is a Django app with its own environment and dependencies, but is configured to work in concert with `wnyc-web-client`. In development mode, `publisher` will make requests to `http://localhost:4200/assets/` for Ember assets (see [`puppy/util/ember_config.py`](https://github.com/nypublicradio/publisher/blob/main/puppy/util/ember_config.py)). So you will need to set up a separate checkout of `publisher` to do any substantial development work on `wnyc-web-client`.

Fortunately, `publisher` has its own set of easy-to-follow getting started instructions.

### Prerequisites

You will need the following software properly installed on your computer. Please follow all the directions as written on the websites of these projects and do not neglect to install their dependencies.

* [Git](http://git-scm.com/downloads)
* Node version 10.0.0 (install using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
* [Ember CLI](https://ember-cli.com/user-guide/#getting-started) (>= 2.6.0)
* [Grunt](http://gruntjs.com/getting-started)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

## Development

As noted above, you must either use the default backend, [Publisher Demo](https://internal.demo2.wnyc.net/) _or_ spin up a checkout of [`publisher`](https://github.com/nypublicradio/publisher) at a web address against which this ember app can make requests. By default, the app will use `https://api.demo.nypr.digital/api` as its destination.

This value is controlled by a `.env` file you will create by following the directions below. Substitute the value of `MY_PORT` with the port of your `publisher` checkout on `dev.wnyc.net`, or replace it with a different address entirely if you are running the `publisher` app somewhere else.

We use [modernizr](https://modernizr.com/) to detect for certain browser features. Rather than include a full build in the app, there is a single Grunt task included in this project which scans all the `.js` and `.scss` files for mentions of the modernizr API. Step 7 below will generate a modernizr build; do not skip it or you may have mysterious errors.

1. `$ git clone git@github.com:nypublicradio/wnyc-web-client.git && cd wnyc-web-client`
2. `$ git checkout <working branch>`
3. `$ cp .env.sample .env`
4. Edit `.env` with your `publisher` app location if you do _not_ want to use Publisher's demo environment, which is the default in `.env.sample`.
5. `$ yarn install`
6. `$ npm install grunt@v1.0.3` :point-left: version can be unpinned if `wnyc-web-client` is migrated to Node >=v10
7. `$ npx grunt modernizr:dist`


The `publisher` service is not set up as a strictly data-only API server and will return HTML with embedded script tags that request against the domain root. To resolve this issue, you should run your local server with the proxy command:
```sh
$ ember serve --proxy=http://wnyc.demo2.wnyc.net
```

## Related features in the Django app

When we fetch pages from the Django app, we include the `X-WNYC-Ember` HTTP header. This allows Django to suppress certain things (like redundant Javascript libraries) that are unnecessary when the Ember app is managing the client side.

[`module_wrapper.py`](https://github.com/nypublicradio/publisher/blob/main/puppy/util/module_wrapper.py) provides a very slim module system around all the legacy Javascript files. See [`app/services/legacy-loader.js`](https://github.com/nypublicradio/wnyc-web-client/blob/main/app/services/legacy-loader.js) for more detail.

## Additional Documentation

See `docs/prototype-report.html` for the original writeup when this application was created.

## Logging and Debug
### `ember-cli-mirage`
We use [`ember-cli-mirage`](http://www.ember-cli-mirage.com/) to provide mock server output against which to develop. It's turned off by default in dev environments, controlled by the `USE_MIRAGE` envvar in your `.env` file. You can turn it on by setting `USE_MIRAGE` to `true`.

Logging by `ember-cli-mirage` is turned off by default, due to how noisy the console becomes if it's turned on. This setting can be changed in [`mirage/config.js`](https://github.com/nypublicradio/wnyc-web-client/blob/main/mirage/config.js). Look for this line:
```
this.logging = false;
```
Set that to `true` and you'll see a line for all the requests that mirage handles, but be warned: there are many.

### `legacy-loader`
`wnyc-web-client` parses `publisher`'s HTML output for `<script>` and `<link>` tags, which it then loads according to matching and ordering rules found in [`app/services/legacy-loader.js`](https://github.com/nypublicradio/wnyc-web-client/blob/main/app/services/legacy-loader.js). By default it will log when it has decided whether or not to load a legacy script. This setting can be turned off by commenting out the following line in [`config/environment.js`](https://github.com/nypublicradio/wnyc-web-client/blob/main/config/environment.js):
```
ENV.LOG_LEGACY_LOADER = true;
```

#### Metrics Adapters
We use [`ember-metrics`](https://github.com/poteto/ember-metrics) to proxy analytics tracking to two backends, our Data Warehouse and Google Analytics. Debug output for the Data Warehouse adapter can be turned on by adding `debug` to the url's query string. GA debugging is handled using [a chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en).

#### Facebook Graph API
This site currently uses version 2.12 of the Facebook Graph API. If we decide to upgrade to the latest version, please be sure to check Facebook's API Upgrade Tool to see which changes need to be made in order to upgrade: https://developers.facebook.com/tools/api_versioning/
