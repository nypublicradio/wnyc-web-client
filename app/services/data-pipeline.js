import { inject as service } from '@ember/service';
import DataPipeline from 'nypr-metrics/services/data-pipeline';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default DataPipeline.extend({
  session: service(),
  browserId: computed.readOnly('session.data.browserId'),
  authorize(fetchOptions) {
    let { provider, access_token } = this.get('session.data.authenticated');
    fetchOptions.headers['Authorization'] = `Bearer ${access_token}`;
    if (!isEmpty(provider)) {
      fetchOptions.headers['X-Provider'] = provider;
    }
      return fetchOptions;
    }
})
