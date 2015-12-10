import DS from 'ember-data';
import moment from 'moment';
const {
  attr,
  belongsTo
} = DS;
import Ember from 'ember';
const {
  get,
  computed
} = Ember;
import { ModelBridge } from '../lib/okra-bridge';

function normalizeTime(time) {
  let hours = moment.duration(time).get('hours');
  let minutes = moment.duration(time).get('minutes');
  let seconds = moment.duration(time).get('seconds');
  seconds = String(seconds).length === 1 ? `0${seconds}` : seconds;

  return `${hours > 0 ? `${hours}:` : ''}${minutes}:${seconds}`;
}
export default DS.Model.extend(ModelBridge, {
  story: belongsTo('story'),

  position: attr('number', {defaultValue: 0}),
  normalizedPosition: computed('position', {
    get() {
      let position = get(this, 'position');
      return normalizeTime(position);
    },
    set(k, v) {
      return v;
    }
  }),
  duration: attr('number', {defaultValue: 0}),
  normalizedDuration: computed('duration', {
    get() {
      let duration = get(this, 'duration');
      return normalizeTime(duration);
    },
    set(k, v) {
      return v;
    }
  }),
  isPlaying: attr('boolean', {defaultValue: false}),
  volume: attr('number', {defaultValue: 100})
});
