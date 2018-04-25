import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';

export default Route.extend({
  dataLayer: service('nypr-metrics/data-layer'),

  beforeModel() {
    schedule('afterRender', () => {
      this.get('dataLayer').send404();
    });
  }
});
