import config from 'wnyc-web-client/config/environment';
import DS from 'ember-data';
import Ember from 'ember';
const { hash } = Ember.RSVP;

export default DS.JSONAPIAdapter.extend({
  host: config.environment === 'development' ? '' : config.wnycAPI, // use proxy to wnyc
  namespace: 'api/v1',
  findAll() {
    let streams, whatsOn;
    let streamUrl = [this.host, this.namespace, 'list/streams'].join('/') + '/';
    let whatsOnUrl = [this.host, this.namespace, 'whats_on'].join('/') + '/';
    streams = Ember.$.get(streamUrl);
    whatsOn = Ember.$.get(whatsOnUrl);
    return hash({streams, whatsOn});
  },
  findRecord(store, type, id/*, snapshot*/) {
    let stream, whatsOn;
    let streamUrl = [this.host, this.namespace, 'list/streams', id].join('/') + '/';
    let whatsOnUrl = [this.host, this.namespace, 'whats_on', id].join('/') + '/';
    stream = Ember.$.get(streamUrl);
    whatsOn = Ember.$.get(whatsOnUrl);
    return hash({stream, whatsOn});
  }
});
