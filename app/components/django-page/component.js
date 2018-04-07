import { inject as service } from '@ember/service';
import Component from 'nypr-django-for-ember/components/django-page';

export default Component.extend({
  session: service(),
});
