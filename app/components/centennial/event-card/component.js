import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  image: readOnly('event.attributes.imageMain'),
  month: computed('event.attributes.start-date', function() {
    return moment(this.get('event.attributes.startDate')).format('MMM');
  }),
  day: computed('event.attributes.start-date', function() {
    return moment(this.get('event.attributes.startDate')).format('DD');
  }),
  tags: computed('event.attributes.tags', function() {
    return this.get('event.attributes.tags').split(', ');
  }),
  isInPerson: computed('tags', function() {
    return this.get('tags').includes('in-person');
  }),
  isLiveStream: computed('tags', function() {
    return this.get('tags').includes('live_stream');
  }),

});
