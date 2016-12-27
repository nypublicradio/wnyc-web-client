import Component from 'ember-component';
import { reads, or } from 'ember-computed';

export default Component.extend({
  tagName:        '',

  streamScheduleUrl: null,
  streamPlaylistUrl: null,
  streamUrl        : null,
  streamName       : null,
  streamsIndexUrl  : null
});
