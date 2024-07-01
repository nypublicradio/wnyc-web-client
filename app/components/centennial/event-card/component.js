import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  image: readOnly('event.attributes.imageMain'),
  month: computed('event.attributes.start-date', function() {
    return moment(this.get('event.attributes.startDate')).format('MMM');
  }),
  day: computed('event.attributes.startDate', function() {
    return moment(this.get('event.attributes.startDate')).format('DD');
  }),
  startTime: computed('event.attributes.{startDate,startTime}', function() {
    return moment(`${this.get('event.attributes.startDate')} ${this.get('event.attributes.startTime')}`).format('h:mm A');
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
  eventUrl: computed('event.attributes.{startDate,slug}', function() {
    const year = moment(this.get('event.attributes.startDate')).format('YYYY');
    const month = moment(this.get('event.attributes.startDate')).format('MMM').toLowerCase();
    const day = moment(this.get('event.attributes.startDate')).format('DD');
    const slug = this.get('event.attributes.slug');
    return `/events/wnyc-events/${year}/${month}/${day}/${slug}/`
  })

});
