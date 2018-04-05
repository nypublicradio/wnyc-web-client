import { get } from '@ember/object';
import Component from 'nypr-django-for-ember/components/django-page';
import service from 'ember-service/inject';

export default Component.extend({
  session: service(),
  legacyAnalytics: service(),
  click(event) {
    let legacyAnalytics = get(this, 'legacyAnalytics');
    legacyAnalytics.dispatch(event);

    if (this.isLegacyEvent(event)) {
      return this.fireLegacyEvent(event.target);
    }
  }
});
