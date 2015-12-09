import DS from 'ember-data';
const {
  attr,
  belongsTo
} = DS;
import { ModelBridge } from '../lib/okra-bridge';

export default DS.Model.extend(ModelBridge, {
  story: belongsTo('story'),

  position: attr('number', {defaultValue: 0}),
  duration: attr('number', {defaultValue: 0}),
  isPlaying: attr('boolean', {defaultValue: false}),
  volume: attr('number', {defaultValue: 100})
});
