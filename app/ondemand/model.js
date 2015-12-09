import DS from 'ember-data';
const {
  attr,
  belongsTo
} = DS;
import { ModelBridge } from '../lib/okra-bridge';

export default DS.Model.extend(ModelBridge, {
  story: belongsTo('story'),

  position: attr('number'),
  duration: attr('number'),
  isPlaying: attr('boolean'),
  volume: attr('number')
});
