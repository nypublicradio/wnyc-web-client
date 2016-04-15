import RavenLogger from 'ember-cli-sentry/services/raven';
import Ember from 'ember';

export default RavenLogger.extend({
  init() {
    Ember.$(document).ajaxError((event, jqXHR, ajaxSettings, thrownError) => {
      // The details of CORS errors are protected by browsers, so we don't get
      // additional metadata. The jQuery default for these errors are 'error',
      // which isn't helpful.
      let fallbackMessage = jqXHR.statusText === 'error' ? "Possibly a CORS error. Extra details are protected." : jqXHR.statusText;
      // if a thrownError is actually though, use that. otherwise use whatever we got from above.
      this.captureMessage(thrownError || fallbackMessage, {
        extra: {
            type: ajaxSettings.type,
            url: ajaxSettings.url,
            data: ajaxSettings.data,
            status: jqXHR.status,
            error: thrownError || jqXHR.statusText,
            response: jqXHR.responseText.substring(0, 100)
        }
      });
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

  ignoreError(error) {
    if (error.promise && error.status === 0) {
      // let global ajaxError handler take this
      return true;
    }
    return this._super();
  },

  callRaven(/* methodName, ...optional */) {
    return this._super(...arguments);
  }
});
