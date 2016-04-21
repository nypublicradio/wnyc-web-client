import RavenLogger from 'ember-cli-deploy-sentry/services/raven';
import Ember from 'ember';

export default RavenLogger.extend({
  // ember-cli-deploy-sentry will use this key as part of a dynamic lookup on the
  // DOM for the revision key. it's currently hardcoded in v0.3.1, but a dynamic
  // method will be released soon. setting this key should guard against when
  // the dep is updated. the updated version uses a different key, so we want to
  // set it here.
  releaseMetaName: 'revision',
  init() {
    Ember.$(document).ajaxError((event, jqXHR, ajaxSettings, thrownError) => {
      let {
        type,
        url,
        data
      } = ajaxSettings;
      let {
        status,
        response
      } = jqXHR;
      response = response ? response.substr(0, 100) : '';
      // The details of CORS errors are protected by browsers, so we don't get
      // additional metadata. The jQuery default for these errors are 'error',
      // which isn't helpful.
      let fallbackMessage = jqXHR.statusText === 'error' ? "Possibly a CORS error. Extra details are protected." : jqXHR.statusText;
      // if a thrownError is passed in, use that. otherwise use whatever we got from above.
      this.captureMessage(thrownError || fallbackMessage, {
        extra: {
          type,
          url,
          data,
          status,
          response,
          error: thrownError || jqXHR.statusText
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
