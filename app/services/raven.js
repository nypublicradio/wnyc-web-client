import RavenLogger from 'ember-cli-deploy-sentry/services/raven';

export default RavenLogger.extend({

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
