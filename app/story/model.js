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
  channel: attr('string'),
  chunks: attr(),
  commentsCount: attr('number'),
  cmsPK: attr('string'),
  correctionText: attr('string'),
  newsdate: attr('string'),
  editLink: attr('string'),
  embedCode: attr('string'),
  enableComments: attr('boolean'),
  headers: attr(),
  headerDonateChunk: attr('string'),
  // TODO: make this a relationship when stories come in only over /api/v3
  // right now they're still consumed from HTML and as part of listing pages
  // imageMain: DS.belongsTo('image'),
  imageMain: DS.attr(),
  itemType: attr('string'),
  itemTypeId: attr('number'),
  isLatest: attr('boolean'),
  largeTeaseLayout: attr('boolean'),
  publishAt: attr('string'),
  series: attr(),
  show: attr('string'),
  slug: attr('string'),
  segments: attr(),
  tease: attr('string'),
  template: attr('string'),
  tags: attr(),
  title: attr('string'),
  transcript: attr('string'),
  twitterHeadline: attr('string'),
  twitterHandle: attr('string'),
  url: attr('string'),
  body: attr('string'),
  bodyDjango: computed ('body', function() {
    let text = get(this, 'body');
    return this.store.createRecord('django-page', { text });
  }),
  mainImageEligible: computed('template', 'imageMain', function(){
    let template = get(this, 'template');
    let imageWidth = get(this, 'imageMain.w');
    let imageDisplayFlag = get(this, 'imageMain.isDisplay');
    if (["story_video", "story_interactive", "story_noimage"].includes(template)) {
      return false;
    } else if (imageWidth >= 800 && imageDisplayFlag === true){
      return true;
    }
  }),
  videoTemplate: computed.equal('template', 'story_video'),
  interactiveTemplate: computed.equal('template', 'story_interactive'),
  flushHeader: computed.or('mainImageEligible', 'videoTemplate', 'segments'),
  escapedBody: computed('body', {
    get() {
      let body = get(this, 'body');
      if (!body) {
        return '';
      }
      return body.replace(/\\x3C\/script>/g, '</script>');
    }
  }),
  pageChunks: computed('chunks', function(){
    //process the raw chunks into django-page records, if they are present
    let processedChunks = {};
    let chunksObj = get(this, 'chunks');
    for (var key in chunksObj){
      let text = chunksObj[key];
      if (text){
        let content = this.store.createRecord('django-page', { text });
        processedChunks[key] = content;
      }
    }
    return processedChunks;
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
    return getProperties(this, 'tags', 'show', 'channel', 'series');
  }
});
