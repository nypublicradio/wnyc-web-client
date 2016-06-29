import JSONAPISerializer from 'ember-data/serializers/json-api';
import service from 'ember-service/inject';

export default JSONAPISerializer.extend({
  session: service(),
  serialize() {
    let json = this._super(...arguments);
    json.meta = { browserId: this.get('session.data.browserId') };
    return json;
  }
});
