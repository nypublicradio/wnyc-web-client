import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';
import parseAnalyticsCode from '../utils/analytics-code-parser';
const { attr, Model } = DS;
const { computed, get } = Ember;


export default Model.extend({
  analyticsCode: attr('string'),
  audio: attr('string'),
  audioAvailable: attr('boolean'),
  audioDurationReadable: attr('string'),
  audioEventually: attr('boolean'),
  audioMayDownload: attr('boolean'),
  audioMayEmbed: attr('boolean'),
  audioShowOptions: attr('boolean'),
  commentsCount: attr('number'),
  commentsEnabled: attr('boolean'),
  cmsPK: attr('number'),
  dateLine: attr('string'),
  dateLineDatetime: attr('string'),
  editLink: attr('string'),
  headers: attr(),
  imageMain: attr(),
  itemType: attr('string'),
  itemTypeId: attr('number'),
  isLatest: attr('boolean'),
  largeTeaseLayout: attr('boolean'),
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
  analytics: computed('analyticsCode', {
    get() {
      let analyticsCode = get(this, 'analyticsCode');
      let {channeltitle, showtitle, seriestitles, isblog} = parseAnalyticsCode(analyticsCode);
      // compact first to guard against returned undefineds
      let gaAction = [channeltitle, showtitle, seriestitles].compact().map((c, i) => {
        if (i === 0 && c) {
          return `${isblog ? 'Blog' : 'Article Channel'}: ${c}`;
        } else if (i === 1 && c) {
          return `Show: ${c}`;
        } else if (i === 2 && c.length) {
          return `Series: ${c.join('+')}`;
        }
      }).compact().join(' | ');
      return {
        gaAction,
        gaLabel: get(this, 'title')
      };
    }
  })
});
