import service from 'ember-service/inject';
import moment from 'moment';
import Component from 'ember-component';
import computed, { and, equal, readOnly, or } from 'ember-computed';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

const STATUSES = {
  LIVE: 'On Air Now',
  LATEST: 'Latest Episode',
  UPCOMING: 'Upcoming Episode'
};

export default Component.extend({
  whatsOn:            service(),
  audio:              service(),

  status:             null,
  streamSlug:         null,
  isFeatured:         false,

  isLive:             equal('status', STATUSES.LIVE),
  isLatest:           readOnly('item.isLatest'),
  isListenableNow:    or('item.audioAvailable', 'isLive'),
  isFancyFeatured:    and('item.largeTeaseLayout', 'item.imageMain', 'isFeatured', 'media.isSmallAndUp'),

  tagName:            'article',
  classNameBindings:  ['featuredClasses', 'fullScreen'],
  classNames:         ['story-tease'],

  itemId: computed('isLive', 'streamSlug', 'item.id', function() {
    return get(this, 'isLive') ? get(this, 'streamSlug') : get(this, 'item.id');
  }),
  isCurrentAudio: computed('audio.currentId', 'itemId', function() {
    return get(this, 'audio.currentId') === get(this, 'itemId');
  }),
  listenState: computed('isCurrentAudio', 'audio.playState', function() {
    return get(this, 'isCurrentAudio') ? get(this, 'audio.playState') : 'is-paused';
  }),
  isListenableEventually: computed('status', function() {
    const status = get(this, 'status');
    const audioEventually = get(this, 'item.audioEventually');
    return status !==  STATUSES.LIVE && status !== null && audioEventually;
  }),
  featuredClasses: computed('isFeatured', 'item.largeTeaseLayout', 'media.isSmallAndUp', function() {
    const isFeatured = get(this, 'isFeatured');
    const lgTease = get(this, 'item.largeTeaseLayout');
    const isSmallAndUp = get(this, 'media.isSmallAndUp');
    if (isFeatured && lgTease && isSmallAndUp) {
      return 'box--dark box--featured';
    } else if (isFeatured) {
      return 'box--nearwhite box--featured';
    }
  }),
  showParent: computed('parentTitle', 'item.headers.brand.title', function() {
    let parentTitle = get(this, 'parentTitle');
    let brandTitle = get(this, 'item.headers.brand.title');
    return parentTitle !== brandTitle;
  }),
  playButton: computed('isFeatured', 'flipped', function() {
    if (this.get('isFeatured') || this.get('flipped')) {
      return 'blue-boss';
    } else {
      return 'blue-minion';
    }
  }),
  endtimeLabel: computed('endtime', function() {
    const endtime = get(this, 'endtime');
    const timeObj = moment(endtime);

    if (timeObj.minutes() === 0) {
      return `until ${timeObj.format('h A')}`;
    } else {
      return `until ${timeObj.format('h:mm A')}`;
    }
  }),

  didRender() {
    this._super(...arguments);
    this._checkWhatsOn();
  },

  actions: {
    listen: function listen(model, streamSlug) {
      let audio = get(this, 'audio');
      let currentAudio = get(this, 'audio.currentAudio.id');
      if (currentAudio === streamSlug && get(this, 'audio.isPlaying')) {
        audio.pause();
      } else {
        audio.playStream(streamSlug);
      }
    }
  },

  _checkWhatsOn() {
    const story = get(this, 'item');
    const pk = get(story, 'id');
    const isLatest = get(this, 'item.isLatest');
    const whatsOn = get(this, 'whatsOn');

    if (!isLatest) {
      return;
    }

    whatsOn.isLive(pk).then(isLive => this._updateStatus(isLive));
  },

  _updateStatus(results) {
    const [isLive, endtime, streamSlug] = results;
    if (isLive) {
      set(this, 'status', STATUSES.LIVE);
      set(this, 'endtime', endtime);
      set(this, 'streamSlug', streamSlug);
    } else if (this._isUpcoming()){
      set(this, 'status', STATUSES.UPCOMING);
    } else {
      set(this, 'status', STATUSES.LATEST);
    }
  },

  _isUpcoming() {
    const datetime = get(this, 'item.dateLineDatetime');
    const itemdate = new Date(datetime);
    const itemdateEpoch = itemdate.getTime();
    const now = new Date();
    const nowEpoch = now.getTime();

    return nowEpoch < itemdateEpoch;
  }
});
