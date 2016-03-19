import Ember from 'ember';

const {
  Mixin,
  inject,
  get
} = Ember;

export default Mixin.create({
  legacyServices: inject.service(),

  actions: {
    listen(model, streamSlug) {
      const id = get(model, 'id');
      const title = get(model, 'title');
      const show = get(model, 'headers.brand.title');
      const legacy = get(this, 'legacyServices');

      if (streamSlug) {
        legacy.streamStation(streamSlug);
      } else {
        legacy.listen(id, title, show);
      }
    },
    queue(model) {
      const id = get(model, 'id');
      const legacy = get(this, 'legacyServices');

      legacy.queue(id);
    }
  }
});
