import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';
import get, { getProperties } from 'ember-metal/get';
import computed from 'ember-computed';
import parseAnalyticsCode from '../utils/analytics-code-parser';
import { shareMetadata } from 'wqxr-web-client/helpers/share-metadata';
const { attr, Model } = DS;

export default Model.extend({
  analyticsCode: attr('string'),
  audio: attr(),
  audioType: 'on_demand',
  audioAvailable: attr('boolean'),
  audioDurationReadable: attr('string'),
  audioEventually: attr('boolean'),
  audioMayDownload: attr('boolean'),
  audioMayEmbed: attr('boolean'),
  audioShowOptions: attr('boolean'),
  commentsCount: attr('number'),
  commentsEnabled: attr('boolean'),
  cmsPK: attr('string'),
  dateLine: attr('string'),
  dateLineDatetime: attr('string'),
  editLink: attr('string'),
  headers: attr(),
  imageMain: attr(),
  itemType: attr('string'),
  itemTypeId: attr('number'),
  isLatest: attr('boolean'),
  largeTeaseLayout: attr('boolean'),
  siteId: attr('number'),
  slug: attr('string'),
  tease: attr('string'),
  title: attr('string'),
  url: attr('string'),
  extendedStory: attr(),
  escapedBody: computed('extendedStory.body', {
    get() {
      let body = get(this, 'extendedStory.body');
      if (!body) {
        return '';
      }
      return body.replace(/\\x3C\/script>/g, '</script>');
    }
  }),
  segmentedAudio: computed('audio', function() {
    return Array.isArray(this.get('audio'));
  }),
  commentSecurityURL(browserId) {
    let data = {
      content_type: 'cms.' + this.get('itemType'),
      object_pk: this.get('id'),
      bust_cache: Math.random()
    };
    if (browserId) {
      data.id = browserId;
    }
    return `${ENV.wnycAccountRoot}/comments/security_info/?${Ember.$.param(data)}`;
  },
  nprAnalyticsDimensions: attr(),
  analytics: computed('analyticsCode', {
    get() {
      let analyticsCode = get(this, 'analyticsCode');
      let {channeltitle, showtitle, seriestitles, isblog, modelchar} = parseAnalyticsCode(analyticsCode);
      // compact first to guard against returned undefineds
      let containers = [channeltitle, showtitle, seriestitles].compact().map((c, i) => {
        if (i === 0 && c) {
          return `${isblog ? 'Blog' : 'Article Channel'}: ${c}`;
        } else if (i === 1 && c) {
          return `Show: ${c}`;
        } else if (i === 2 && c.length) {
          return `Series: ${c.join('+')}`;
        }
      }).compact().join(' | ');
      if (modelchar === 'n' && !containers) {
        containers = 'NPR';
      }
      return {
        containers,
        title: get(this, 'title')
      };
    }
  }),
  shareMetadata: computed(function() {
    return shareMetadata(this);
  }),
  
  // so Ember Simple Auth inludes a records ID when it saves
  toJSON() {
    var serializer = this.store.serializerFor('story');
    var snapshot = this._internalModel.createSnapshot();
    return serializer.serialize(snapshot, {includeId: true});
  },
  getNextSegment() {
    if (!this.get('segmentedAudio')) {
      return null;
    } else if (!this.hasNextSegment()) {
      // wrap around
      this.resetSegments();
      return this.get('audio.firstObject');
    } else {
      return this.get('audio')[this.incrementProperty('_currentSegment')];
    }
  },
  getCurrentSegment() {
    if (!this.get('segmentedAudio')) {
      return this.get('audio');
    } else {
      return this.get('audio')[this.get('_currentSegment') || 0];
    }
  },
  hasNextSegment() {
    if (!this.get('segmentedAudio')) {
      return false;
    } else {
      return this.getCurrentSegment() !== this.get('audio.lastObject');
    }
  },
  resetSegments() {
    if (!this.get('segmentedAudio')) {
      return this.get('audio');
    } else {
      this._currentSegment = 0;
      return this.getCurrentSegment();
    }
  },
  
  forListenAction(data) {
    return Ember.RSVP.Promise.resolve(Object.assign({
      audio_type: 'on_demand',
      cms_id: this.get('id'),
      item_type: this.get('itemType'),
    }, data));
  },
  
  forDfp() {
    return getProperties(this.get('extendedStory'), 'tags', 'show', 'channel', 'series');
  }
});
