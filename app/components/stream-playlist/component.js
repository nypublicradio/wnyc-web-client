import Component from 'ember-component';
import computed, { readOnly } from 'ember-computed';
import service from 'ember-service/inject';
import get from 'ember-metal/get';


export default Component.extend({
  store: service(),
  stream: null,
  homepage: computed('stream', function() {
    let homepages = get(this, 'homepageList');
    let slug = get(this, 'stream.id');
    return homepages[slug];
  }),
  currentItem: readOnly('stream.currentPlaylistItem.playlistEntryId'),
  historyItems: computed('stream.playlist.items.[]', 'currentItem', function() {
    let currentId = this.get('currentItem');
    let playlist = this.get('stream.playlist.items');
    if (!playlist) {
      return [];
    }
    return playlist.filter(i => Date.now() / 1000 > i.startTimeTs)
      .rejectBy('playlistEntryId', currentId)
      .sortBy('startTimeTs')
      .reverse();
  }),
  homepageList: {
    // These don't seem to be part of an api
    // Putting them here for now since this is the only component that uses them
    'wqxr':             'http://www.wqxr.org',
    'q2':               'http://www.wqxr.org/series/q2/',
    'wqxr-special':     'http://www.wqxr.org/blogs/operavore/',
    'jonathan-channel': 'http://www.wnyc.org/series/jonathan-channel'
  }
});
