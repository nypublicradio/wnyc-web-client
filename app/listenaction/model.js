import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  pk: attr('number'), // object ID
  action: attr('string'), // 'pause' | 'skip' | 'play' | 'complete' | 'delete' | 'heardstream'
  value: attr('number'), // <seconds if action=='pause, absent otherwise>
  ts: attr('number'), // Unixstyle epoch integer timestamp for when this event occured
});
