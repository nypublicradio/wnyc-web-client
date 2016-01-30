import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';
const { attr, Model } = DS;


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
  commentSecurityURL(browserId) {
    let data = {
      content_type: 'cms.' + this.get('itemType'),
      object_pk: this.get('id'),
      bust_cache: Math.random()
    };
    if (browserId) {
      data.id = browserId;
    }
    return `${ENV.wnycAccountAPI}/comments/security_info/?${Ember.$.param(data)}`;
  }
});
