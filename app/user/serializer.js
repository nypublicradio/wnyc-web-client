import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  keyForAttribute: attr => attr.underscore(),
  attrs: {
    facebookId: "custom:facebook_id",
  },
  serialize(snapshot, options) {
    let { data : { attributes:json } } = this._super(snapshot, options);
    let typedPassword = snapshot.record.get('typedPassword');

    if (typedPassword) {
      json = Object.assign(json, { password: snapshot.record.get('typedPassword') });
    }

    return json;
  }
});
