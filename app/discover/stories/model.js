import Model from 'ember-data/model';
import attr from  'ember-data/attr';
import { reads } from '@ember/object/computed';

export default Model.extend({
  title:                  attr('string'),
  headers:                attr(),
  tease:                  attr('string'),
  showTitle:              reads('headers.brand.title'),
  showUrl:                reads('headers.brand.url'),
  summary:                reads('tease'),
  slug:                   attr('string'),
  newsdate:               attr('string'),
  estimatedDuration:      attr('number'),
  audioDurationReadable:  attr('string'),
  url:                    attr('string'),
  audio:                  attr('string'),
  cmsPK:                  attr('string'),

  // so Ember Simple Auth inludes a records ID when it saves
  toJSON() {
    var serializer = this.store.serializerFor(this._internalModel.modelName);
    var snapshot   = this._internalModel.createSnapshot();
    let serialized = serializer.serialize(snapshot, {includeId: true});
    return serialized;
  }
});
