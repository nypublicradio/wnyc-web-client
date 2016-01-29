import DS from 'ember-data';
const { attr }  = DS;

export default DS.Model.extend({
  audio: attr('string'),
  audioAvailable: attr('boolean'),
  audioEventually: attr('boolean'),
  audioDurationReadable: attr('string'),
  dateLine: attr('string'),
  dateLineDatetime: attr('string'),
  editLink: attr('string'),
  headers: attr(),
  imageMain: attr(),
  isLatest: attr('boolean'),
  largeTeaseLayout: attr('boolean'),
  slug: DS.attr('string'),
  tease: attr('string'),
  title: attr('string'),
  url: attr('string'),
  extendedStory: attr()
});
