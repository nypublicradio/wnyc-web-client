import { inject as service } from '@ember/service';
import DataPipeline from 'nypr-metrics/services/data-pipeline';
import { computed } from '@ember/object';

export default DataPipeline.extend({
  session: service(),
  browserId: computed.readOnly('session.data.browserId'),
  authorize(fetchOptions) {
    fetchOptions.headers = this.get('session').authorize(fetchOptions.headers);
    return fetchOptions;
  }
})
