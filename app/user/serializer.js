import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute: attr => attr.underscore(),
  serialize(snapshot, options) {
    var json = this._super(snapshot, options);
    json = Object.assign(json, { password: snapshot.record.get('typedPassword') });
    return json;
  },
  serializeIntoHash(hash, typeClass, snapshot, options) {
    Object.assign(hash, this.serialize(snapshot, options));
  }
});
