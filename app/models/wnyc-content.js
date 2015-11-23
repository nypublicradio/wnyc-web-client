import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'wnyc-wrapper/config/environment';
const { attr } = DS;

export default DS.Model.extend({
  analysticsString: attr('string'),
  authors: attr(),
  channel: attr(),
  commentsCount: attr('integer'),
  commentsEnabled: attr('boolean'),
  item_type: attr('string'),
  item_type_id: attr('integer'),
  published: attr('boolean'),
  show: attr('string'),
  show_title: attr('string'),
  tags: attr(),
  title: attr('string'),

  commentSecurityURL(browserId) {
    let data = {
      content_type: 'cms.' + this.get('item_type'),
      object_pk: this.get('id'),
      bust_cache: Math.random()
    };
    if (browserId) {
      data.id = browserId;
    }
    return `${ENV.wnycAccountAPI}/comments/security_info/?${Ember.$.param(data)}`;
  }
});
