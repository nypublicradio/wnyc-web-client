import Model from 'ember-data/model';
import attr from  'ember-data/attr';

export default Model.extend({
  title:              attr('string'),
  showTitle:          attr('string'),
  showUrl:            attr('string'),
  summary:            attr('string'),
  date:               attr('date'),
  estimatedDuration:  attr('number'),
  url:                attr('string'),
  audio:              attr('string'),
  cmsPK:              attr('string'),

  // so Ember Simple Auth inludes a records ID when it saves
  toJSON() {
    var serializer = this.store.serializerFor(this._internalModel.modelName);
    var snapshot   = this._internalModel.createSnapshot();
    let serialized = serializer.serialize(snapshot, {includeId: true});

    // The snapshotter converts camelCased attributes to dasherized, and we
    // don't want that, because store.push() wants them as they exist in the model

    // There might be a better way to do this.

    serialized.data.attributes = snapshot._attributes;
    return serialized;
  }
});
