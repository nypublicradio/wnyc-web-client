## Module Report
### Unknown Global

**Global**: `Ember.Inflector`

**Location**: `app/channel/route.js` at line 5

```js
import Ember from 'ember';
const {
  Inflector,
  get,
  set
```

### Unknown Global

**Global**: `Ember.Inflector`

**Location**: `app/mixins/listing-route.js` at line 11

```js
  isEmpty,
  $,
  Inflector
} = Ember;
const inflect = new Inflector(Inflector.defaultRules);
```

### Unknown Global

**Global**: `Ember.testing`

**Location**: `app/services/raven.js` at line 13

```js
  init() {
    Ember.$(document).ajaxError((event, jqXHR, ajaxSettings, thrownError) => {
      if (Ember.testing) {
        return;
      }
```

### Unknown Global

**Global**: `Ember.Test`

**Location**: `tests/helpers/google-analytics-stub.js` at line 4

```js
import GoogleAnalytics from 'wqxr-web-client/metrics-adapters/google-analytics';

export default Ember.Test.onInjectHelpers(function() {
  GoogleAnalytics.reopen({
    init() {},
```
