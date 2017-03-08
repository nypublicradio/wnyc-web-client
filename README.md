# WQXR Web Client
[![CircleCI](https://img.shields.io/circleci/token/79cbe978f67ba6a90a048146da6f513d8001997a/project/github/nypublicradio/wqxr-web-client/master.svg?style=flat-square)](https://circleci.com/gh/nypublicradio/wqxr-web-client/tree/master) [![GitHub release](https://img.shields.io/github/release/nypublicradio/wqxr-web-client.svg?style=flat-square)](https://github.com/nypublicradio/wqxr-web-client/releases/latest) [![GitHub pull requests](https://img.shields.io/github/issues-pr/nypublicradio/wqxr-web-client.svg?style=flat-square)](https://github.com/nypublicradio/wqxr-web-client/pulls) [![GitHub contributors](https://img.shields.io/github/contributors/nypublicradio/wqxr-web-client.svg?style=flat-square)](https://github.com/nypublicradio/wqxr-web-client/graphs/contributors) 

This is a browser-based client for interfacing with the New York Public Radio digital infrastructure.  This Ember application renders all of www.wqxr.org using the preexisting Django server as a backend data source, consuming HTML documents and JSON payloads to present a dynamic interface. This gives us the benefits of a persistent in-browser application while still using the existing content and infrastructure.

## Getting Started

This ember app is a **client**, which means its primary purpose is to provide an interface to data source. On its own, this application will not do much without some kind of source from which it can retrieve content to display. To this end, you will need to run a checkout of [`publisher`](https://github.com/nypublicradio/publisher) as a **server**.

`publisher` is a Django app with its own environment and dependencies, but is configured to work in concert with `wqxr-web-client`. In development mode, `publisher` will make requests to `http://localhost:4200/assets/` for Ember assets (see [`puppy/util/ember_config.py`](https://github.com/nypublicradio/publisher/blob/master/puppy/util/ember_config.py)). So you will need to set up a separate checkout of `publisher` to do any substantial development work on `wqxr-web-client`.

Fortunately, `publisher` has its own set of easy-to-follow getting started instructions.

### Prerequisites

You will need the following software properly installed on your computer. Please follow all the directions as written on the websites of these projects and do not neglect to install their dependencies.

* [Git](http://git-scm.com/downloads)
* [Ember CLI](https://ember-cli.com/user-guide/#getting-started) (>= 2.6.0)
* [Compass](http://compass-style.org/install)
* [Grunt](http://gruntjs.com/getting-started)

## Development

As noted above, you must spin up a checkout of [`publisher`](https://github.com/nypublicradio/publisher) at a web address against which this ember app can make requests. By default, the app will use `http://dev.wnyc.net:MY_PORT` as its destination.

This value is controlled by a `.env` file you will create by following the directions below. Substitute the value of `MY_PORT` with the port of your `publisher` checkout on `dev.wnyc.net`, or replace it with a different address entirely if you are running the `publisher` app somewhere else.

We use [modernizr](https://modernizr.com/) to detect for certain browser features. Rather than include a full build in the app, there is a single Grunt task included in this project which scans all the `.js` and `.scss` files for mentions of the modernizr API. Step 9 below will generate a modernizr build; do not skip it or you may have mysterious errors.

1. `$ git clone git@github.com:nypublicradio/wqxr-web-client.git && cd wnyc-web-client`
2. `$ git checkout <working branch>`
3. `$ cp .env.sample .env`
4. Edit `.env` with your `publisher` app location
7. `$ npm install`
8. `$ bower install`
9. `$ grunt modernizr:dist`

The `publisher` service is not set up as a strictly data-only API server and will return HTML with embedded script tags that request against the domain root. To resolve this issue, you should run your local server with the proxy command:
```sh
$ ember serve --proxy http://dev.wnyc.net:MY_PORT
```

## Related features in the Django app

When we fetch pages from the Django app, we include the `X-WNYC-Ember` HTTP header. This allows Django to suppress certain things (like redundant Javascript libraries) that are unnecessary when the Ember app is managing the client side.

[`module_wrapper.py`](https://github.com/nypublicradio/publisher/blob/master/puppy/util/module_wrapper.py) provides a very slim module system around all the legacy Javascript files. See [`app/services/legacy-loader.js`](https://github.com/nypublicradio/wnyc-web-client/blob/master/app/services/legacy-loader.js) for more detail.

## Additional Documentation

See `docs/prototype-report.html` for the original writeup when this application was created.

## Logging and Debug
### `ember-cli-mirage`
We use [`ember-cli-mirage`](http://www.ember-cli-mirage.com/) to provide mock server output against which to develop. It's turned off by default in dev environments, controlled by the `USE_MIRAGE` envvar in your `.env` file. You can turn it on by setting `USE_MIRAGE` to `true`.

Logging by `ember-cli-mirage` is turned off by default, due to how noisy the console becomes if it's turned on. This setting can be changed in [`mirage/config.js`](https://github.com/nypublicradio/wnyc-web-client/blob/master/mirage/config.js). Look for this line:
```
this.logging = false;
```
Set that to `true` and you'll see a line for all the requests that mirage handles, but be warned: there are many.

### `legacy-loader`
`wqxr-web-client` parses `publisher`'s HTML output for `<script>` and `<link>` tags, which it then loads according to matching and ordering rules found in [`app/services/legacy-loader.js`](https://github.com/nypublicradio/wqxr-web-client/blob/master/app/services/legacy-loader.js). By default it will log when it has decided whether or not to load a legacy script. This setting can be turned off by commenting out the following line in [`config/environment.js`](https://github.com/nypublicradio/wqxr-web-client/blob/master/config/environment.js):
```
ENV.LOG_LEGACY_LOADER = true;
```

#### Metrics Adapters
We use [`ember-metrics`](https://github.com/poteto/ember-metrics) to proxy analytics tracking to two backends, our Data Warehouse and Google Analytics. Debug output for the Data Warehouse adapter can be turned on by adding `debug` to the url's query string. GA debugging is handled using [a chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en).
