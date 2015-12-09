import DS from 'ember-data';
const {
  attr,
} = DS;
import { ModelBridge } from '../lib/okra-bridge';

export default DS.Model.extend(ModelBridge, {
  hasPlaylists: attr('boolean'),
  imageLogo: attr('string'),
  scheduleUrl: attr('string'),
  name: attr('string'),
  shortDescription: attr('string'),
  slug: attr('string'),
  whatsOn: attr('number'),
  position: attr('number')
});
