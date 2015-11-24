# Introduction

This is an Ember application that renders all of www.wnyc.org using the preexisting Django server as a backend data source. This gives us the benefits of a persistent in-browser application while still using the existing content and infrastructure.

As of November 24, 2015 it is a fairly robust prototype, but work remains before it is deployable to production.

# Getting Started

This is a stock ember-cli application, so to get it running all you
should need is to point `wnycURL` and `wnycMediaURL` (in
`config/enviornment.js`) at a Django server, and run the usual `npm
install; bower install; ember s`. This gives you a development environment where you are booting directly into the Ember app, which is the most convenient way to do development.

# Related features in the Django app

When we fetch pages from the Django app, we include the `X-WNYC-Ember` HTTP header. This allows Django to suppress certain things (like redundant Javascript libraries) that are unnecessary when the Ember app is managing the clientside.

`module_wrapper.py` provides a very slim module system around all the legacy Javascript files. See `overhaul/app/services/legacy-loader.js` for more detail.

# Overlaying server-generated pages with rich components

The `story` route is a good example of how to take a server-generated page and embed Ember components inside of it. The components I'm using there were taken out of the earlier `overhaul-story` app and integrated into this app.

# Additional Documentation

See `docs/prototype-report.html` for the original writeup when this application was created.
