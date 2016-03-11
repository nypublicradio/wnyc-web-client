/* globals moment */
import Ember from 'ember';
import LegacySupport from '../../mixins/legacy-support';
import service from 'ember-service/inject';

const {
  Component,
  get,
  set,
  computed,
} = Ember;

export default Component.extend(LegacySupport, {
  whatsOn: service(),

  tagName: 'article',
  status: null,
  isFeatured: false,
  isFeaturedAndNotNarrow: computed.and('media.isSmallAndUp', 'isFeatured'),
  isLive: computed.equal('status', 'live'),
  isLatest: computed.readOnly('item.isLatest'),
  isListenableNow: computed.or('item.audioAvailable', 'isLive'),
  isListenableEventually: computed('status', {
    get() {
      const status = get(this, 'status');
      const audioEventually = get(this, 'item.audioEventually');
      return status !== 'live' && status !== null && audioEventually;
    }
  }),
  classNameBindings: ['featuredClasses'],
  lgTeaseAndImage: computed.and('item.largeTeaseLayout', 'item.imageMain', 'isFeaturedAndNotNarrow'),
  featuredClasses: computed('isFeatured', 'item.largeTeaseLayout', 'media.isSmallAndUp', {
    get() {
      const isFeatured = get(this, 'isFeatured');
      const lgTease = get(this, 'item.largeTeaseLayout');
      const isSmallAndUp = get(this, 'media.isSmallAndUp');
      if (isFeatured && lgTease && isSmallAndUp) {
        return 'box--dark box--featured';
      } else if (isFeatured) {
        return 'box--nearwhite box--featured';
      }
    },
    set(k, v) {
      return v;
    }
  }),
  label: computed('status', {
    get() {
      const status = get(this, 'status');

      switch(status) {
        case 'live':
          return 'On Air Now';
        case 'upcoming':
          return 'Upcoming Episode';
        case 'latest':
          return 'Latest Episode';
        default:
          return '';
      }
    }
  }),
  endtimeLabel: computed('endtime', {
    get() {
      const endtime = get(this, 'endtime');
      const timeObj = moment(endtime);

      if (timeObj.minutes() === 0) {
        return `until ${timeObj.format('h A')}`;
      } else {
        return `until ${timeObj.format('h:mm A')}`;
      }
    }
  }),
  didInitAttrs() {
    const hideLinks = get(this, 'hideLinks');
    const story = get(this, 'item');
    if (hideLinks) {
      set(story, 'headers.links', null);
    }

    this._checkWhatsOn();
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
    const [isLive, endtime, livestream] = results;
    if (isLive) {
      set(this, 'status', 'live');
      set(this, 'endtime', endtime);
      set(this, 'livestream', livestream)
    } else if (this._isUpcoming()){
      set(this, 'status', 'upcoming');
    } else {
      set(this, 'status', 'latest');
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
