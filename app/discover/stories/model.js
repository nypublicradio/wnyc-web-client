import Model from 'ember-data/model';
import attr from  'ember-data/attr';

export default Model.extend({
  title:                  attr('string'),
  showTitle:              attr('string'),
  showUrl:                attr('string'),
  summary:                attr('string'),
  dateLine:               attr('string'),
  dateLineDatetime:       attr('string'),
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
