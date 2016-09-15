import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize() {
    let {whatsOns} = Serializer.prototype.serialize.apply(this, arguments);
    if (whatsOns.length === 1) {
      return whatsOns[0];
    }
    let r = {};
    whatsOns.forEach(o => r[o.slug] = o);
    return r;
  }
});
