import Component from 'ember-component';
import service from 'ember-service/inject';
import { readOnly } from 'ember-computed';

export default Component.extend({
  audio: service(),
  store: service(),
  stream: null,
  slug: readOnly('stream.slug'),
  showTitle: readOnly('stream.currentShow.title'),
  episodeTitle: readOnly('stream.currentShow.episodeTitle')
});
