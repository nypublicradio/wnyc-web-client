import { inject as service } from '@ember/service';
import DataPipeline from 'nypr-metrics/services/data-pipeline';
import { computed } from '@ember/object';

export default DataPipeline.extend({
  session: service(),
  browserId: computed.readOnly('session.data.browserId'),
  authorize(fetchOptions) {
    this.get('session').authorize('authorizer:nypr', (header, value) => {
      fetchOptions.headers[header] = value;
    });
    return fetchOptions;
  }
})
