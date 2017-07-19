import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  attrs: {
    facebookId: 'custom:facebook_id'
  },
  keyForAttribute: attr => attr.underscore(),
  serialize(snapshot, options) {
    let { data : { attributes:json } } = this._super(snapshot, options);
    let typedPassword = snapshot.record.get('typedPassword');

    if (typedPassword) {
      json = Object.assign(json, { password: snapshot.record.get('typedPassword') });
    }
    return json;
  },
  serializeIntoHash(hash, typeClass, snapshot, options) {
    Object.assign(hash, this.serialize(snapshot, options));
  },
});
