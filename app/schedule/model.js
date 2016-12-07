import Ember from 'ember';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  start: DS.attr('date'),
  end: DS.attr('date'),
  objType: DS.attr(),
  scheduleEventTitle: DS.attr(),
  scheduleEventUrl: DS.attr(),
  parentTitle: DS.attr(),
  parentUrl: DS.attr(),

  objIsSchedule: Ember.computed.equal('objType', 'ShowSchedule'),
  startReadable: Ember.computed('start', function () {
    // Timezones from the API are Eastern timezone, but provided w/o a
    // timezone. 'UTC' is necessary to not shift the time away from ET.
    return moment.utc(this.get('start')).format('h:mm A');
  }),
});
