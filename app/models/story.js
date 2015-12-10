import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    url: DS.attr('string'),
    tease: DS.attr('string'),
    imageMain: DS.attr(),
    dateLine: DS.attr('string'),
    headers: DS.attr(),
    audio: DS.attr('string'),
    audioDurationReadable: DS.attr('string'),
    audioAvailable: DS.attr('boolean'),
    audioEventually: DS.attr('boolean'),
    slug: DS.attr('string'),
});
