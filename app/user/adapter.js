import ENV from '../config/environment';
import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:nypr',
  host: ENV.wnycAuthAPI,
  buildURL(modelName, id, snapshot, requestType/*, query*/) {
    if (/createRecord|updateRecord/.test(requestType)) {
      return `${this.host}/v1/user`;
    } else if (requestType.startsWith('query')) {
      return `${this.host}/v1/session`;
    }
  },
  normalizeErrorResponse(status, headers, payload) {
    if (payload && typeof payload === 'object' && payload.error) {
      return payload.error;
    } else {
      return [
        {
          status: `${status}`,
          title: "The backend responded with an error",
          detail: `${payload}`
        }
      ];
    }
  },
});
