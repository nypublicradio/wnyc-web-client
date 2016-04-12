import Ember from 'ember';
import config from 'overhaul/config/environment';
import RavenLogger from 'ember-cli-sentry/services/raven';

export default RavenLogger.extend({
  init() {
    /*global Raven*/
    this._super(...arguments);
    Raven.setTransport(({data, onError, onSuccess}) => {
      Ember.$.ajax(config.sentry.dsn, {
          data,
          xhrFields: {withCredentials: true},
          type: 'POST'})
        .success(onSuccess).error(onError);
    });
  },

  unhandledPromiseErrorMessage: '',

  captureException(/* error */) {
    this._super(...arguments);
  },

  captureMessage(/* message */) {
    return this._super(...arguments);
  },

  enableGlobalErrorCatching() {
    return this._super(...arguments);
  },

  ignoreError() {
    return this._super();
  },

  callRaven(/* methodName, ...optional */) {
    return this._super(...arguments);
  }
});
