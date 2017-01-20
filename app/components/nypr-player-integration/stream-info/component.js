import Ember from 'ember';

export default Ember.Component.extend({
  tagName                : '',

  streamScheduleUrlTarget: '',
  streamScheduleUrl      : null,

  streamPlaylistUrlTarget: '',
  streamPlaylistUrl      : null,

  streamName             : null,
  streamsIndexUrl        : null,
  streamsIndexUrlTarget  : ''
});
